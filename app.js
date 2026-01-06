// Main Application Logic
class DoomHygieneApp {
    constructor() {
        this.articles = [];
        this.displayedArticles = 0;
        this.isLoading = false;
        this.hasMoreArticles = true;
        this.observer = null;
        
        this.elements = {
            articlesContainer: document.getElementById('articles'),
            loader: document.getElementById('loader'),
            endMessage: document.getElementById('end-message'),
            languageSelector: document.getElementById('language'),
            bookmarksPanel: document.getElementById('bookmarks-panel'),
            bookmarksList: document.getElementById('bookmarks-list'),
            showBookmarksBtn: document.getElementById('show-bookmarks'),
            closeBookmarksBtn: document.getElementById('close-bookmarks'),
            bookmarkCount: document.getElementById('bookmark-count')
        };
        
        this.init();
    }

    async init() {
        // Load saved language preference
        const savedLanguage = Storage.get(STORAGE_KEYS.LANGUAGE)[0] || 'en';
        this.elements.languageSelector.value = savedLanguage;
        setLanguage(savedLanguage);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial articles
        await this.loadArticles();
        this.renderArticles();
        
        // Update bookmark count
        this.updateBookmarkCount();
    }

    setupEventListeners() {
        // Language selector
        this.elements.languageSelector.addEventListener('change', async (e) => {
            const newLanguage = e.target.value;
            setLanguage(newLanguage);
            Storage.set(STORAGE_KEYS.LANGUAGE, [newLanguage]);
            
            // Reload articles for new language
            this.articles = [];
            this.displayedArticles = 0;
            this.hasMoreArticles = true;
            this.elements.articlesContainer.innerHTML = '';
            
            await this.loadArticles();
            this.renderArticles();
        });

        // Infinite scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.shouldLoadMore()) {
                    this.renderArticles();
                }
            }, 100);
        });

        // Bookmarks panel
        this.elements.showBookmarksBtn.addEventListener('click', () => {
            this.openBookmarksPanel();
        });

        this.elements.closeBookmarksBtn.addEventListener('click', () => {
            this.closeBookmarksPanel();
        });

        // Close panel on click outside
        this.elements.bookmarksPanel.addEventListener('click', (e) => {
            if (e.target === this.elements.bookmarksPanel) {
                this.closeBookmarksPanel();
            }
        });
    }

    async loadArticles() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Show skeleton cards immediately
        this.elements.articlesContainer.innerHTML = Array(6).fill(0).map(() => 
            '<article class="article-card loading"></article>'
        ).join('');

        try {
            const language = this.elements.languageSelector.value;
            const newArticles = await loadFeedsForLanguage(language);
            this.articles = newArticles;
            this.hasMoreArticles = this.articles.length > 0;
            
            // Clear skeleton and render real articles
            this.elements.articlesContainer.innerHTML = '';
            this.renderArticles();
            
        } catch (error) {
            console.error('Error loading articles:', error);
            this.elements.articlesContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <p style="color: #666; margin-bottom: 1rem; font-size: 1.125rem;">
                        ${error.message === 'No articles could be loaded' 
                            ? '❌ Failed to load articles' 
                            : '⏱️ Loading timed out'}
                    </p>
                    <button onclick="location.reload()" style="
                        padding: 0.75rem 1.5rem;
                        background: var(--color-accent);
                        color: white;
                        border: none;
                        border-radius: var(--border-radius);
                        cursor: pointer;
                        font-family: var(--font-sans);
                        font-size: 1rem;
                        transition: var(--transition);
                    " onmouseover="this.style.background='#6b5d4f'" onmouseout="this.style.background='var(--color-accent)'">
                        🔄 Retry
                    </button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    shouldLoadMore() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - CONFIG.scrollThreshold;
        return scrollPosition >= threshold && !this.isLoading && this.hasMoreArticles;
    }

    renderArticles() {
        const articlesToRender = this.articles.slice(
            this.displayedArticles,
            this.displayedArticles + CONFIG.articlesPerLoad
        );

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        articlesToRender.forEach(article => {
            const articleElement = this.createArticleElement(article);
            fragment.appendChild(articleElement);
        });

        this.elements.articlesContainer.appendChild(fragment);
        this.displayedArticles += articlesToRender.length;

        if (this.displayedArticles >= this.articles.length) {
            this.hasMoreArticles = false;
            this.showEndMessage();
        }
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        if (this.observer) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMoreArticles && !this.isLoading) {
                    this.renderArticles();
                }
            });
        }, { rootMargin: '400px' });
        
        // Observe last article
        const lastArticle = this.elements.articlesContainer.lastElementChild;
        if (lastArticle && lastArticle.classList.contains('article-card')) {
            this.observer.observe(lastArticle);
        }
    }

    createArticleElement(article) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.dataset.articleId = article.id;

        // Check if article is read
        if (Storage.has(STORAGE_KEYS.READ, article.id)) {
            card.classList.add('read');
        }

        // Clean description
        const cleanDesc = this.stripHTML(article.description).substring(0, 250);
        const description = cleanDesc + (cleanDesc.length >= 250 ? '...' : '');

        // Format date
        const formattedDate = article.date ? new Date(article.date).toLocaleDateString(currentLanguage, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';

        card.innerHTML = `
            <div class="article-meta">
                <span class="article-source">${this.escapeHTML(article.source)}</span>
                ${formattedDate ? `<span class="article-date-inline">· ${formattedDate}</span>` : ''}
                <span class="article-category">${t('categories.' + article.category)}</span>
            </div>
            
            <h2 class="article-title">
                <a href="${this.escapeHTML(article.link)}" target="_blank" rel="noopener noreferrer">
                    ${this.escapeHTML(article.title)}
                </a>
            </h2>
            
            ${description ? `<p class="article-description">${this.escapeHTML(description)}</p>` : ''}
            
            <div class="article-actions">
                <button class="action-btn like ${Storage.has(STORAGE_KEYS.LIKES, article.id) ? 'active' : ''}" 
                        data-action="like" data-id="${article.id}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.LIKES, article.id) ? '❤️' : '🤍'}</span>
                    <span>${t('like')}</span>
                </button>
                
                <button class="action-btn bookmark ${Storage.has(STORAGE_KEYS.BOOKMARKS, article.id) ? 'active' : ''}" 
                        data-action="bookmark" data-id="${article.id}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.BOOKMARKS, article.id) ? '🔖' : '📑'}</span>
                    <span>${t('bookmark')}</span>
                </button>
                
                <button class="action-btn read ${Storage.has(STORAGE_KEYS.READ, article.id) ? 'active' : ''}" 
                        data-action="read" data-id="${article.id}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.READ, article.id) ? '✓' : '○'}</span>
                    <span>${t('markAsRead')}</span>
                </button>
            </div>
        `;

        // Add event listeners to action buttons
        card.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAction(btn, article);
            });
        });

        // Mark as read when clicking the article link
        const articleLink = card.querySelector('.article-title a');
        articleLink.addEventListener('click', () => {
            setTimeout(() => {
                this.markAsRead(article.id, card);
            }, 100);
        });

        return card;
    }

    handleAction(button, article) {
        const action = button.dataset.action;
        const articleId = article.id;

        switch (action) {
            case 'like':
                this.toggleLike(articleId, button);
                break;
            case 'bookmark':
                this.toggleBookmark(articleId, button, article);
                break;
            case 'read':
                this.toggleRead(articleId, button);
                break;
        }
    }

    toggleLike(articleId, button) {
        const isLiked = Storage.toggle(STORAGE_KEYS.LIKES, articleId);
        button.classList.toggle('active', isLiked);
        button.querySelector('.icon').textContent = isLiked ? '❤️' : '🤍';
    }

    toggleBookmark(articleId, button, article) {
        const isBookmarked = Storage.toggle(STORAGE_KEYS.BOOKMARKS, articleId);
        
        if (isBookmarked) {
            Storage.saveBookmarkedArticle(article);
        } else {
            Storage.removeBookmarkedArticle(articleId);
        }
        
        button.classList.toggle('active', isBookmarked);
        button.querySelector('.icon').textContent = isBookmarked ? '🔖' : '📑';
        
        this.updateBookmarkCount();
    }

    toggleRead(articleId, button) {
        const isRead = Storage.toggle(STORAGE_KEYS.READ, articleId);
        button.classList.toggle('active', isRead);
        button.querySelector('.icon').textContent = isRead ? '✓' : '○';
        
        // Update article card appearance
        const card = document.querySelector(`[data-article-id="${articleId}"]`);
        if (card) {
            card.classList.toggle('read', isRead);
        }
    }

    markAsRead(articleId, card) {
        if (!Storage.has(STORAGE_KEYS.READ, articleId)) {
            Storage.add(STORAGE_KEYS.READ, articleId);
            card.classList.add('read');
            
            const readBtn = card.querySelector('[data-action="read"]');
            if (readBtn) {
                readBtn.classList.add('active');
                readBtn.querySelector('.icon').textContent = '✓';
            }
        }
    }

    openBookmarksPanel() {
        this.elements.bookmarksPanel.classList.add('open');
        this.renderBookmarks();
    }

    closeBookmarksPanel() {
        this.elements.bookmarksPanel.classList.remove('open');
    }

    renderBookmarks() {
        const bookmarkedArticles = Storage.getBookmarkedArticles();
        const bookmarkIds = Storage.get(STORAGE_KEYS.BOOKMARKS);
        
        if (bookmarkIds.length === 0) {
            this.elements.bookmarksList.innerHTML = `
                <div class="empty-state">${t('noBookmarks')}</div>
            `;
            return;
        }

        this.elements.bookmarksList.innerHTML = '';
        
        bookmarkIds.forEach(id => {
            const article = bookmarkedArticles[id];
            if (!article) return;

            const bookmarkItem = document.createElement('div');
            bookmarkItem.className = 'bookmark-item';
            
            bookmarkItem.innerHTML = `
                <div class="article-meta">
                    <span class="article-source">${this.escapeHTML(article.source)}</span>
                    <span class="article-category">${t('categories.' + article.category)}</span>
                </div>
                <h3 class="article-title">
                    <a href="${this.escapeHTML(article.link)}" target="_blank" rel="noopener noreferrer">
                        ${this.escapeHTML(article.title)}
                    </a>
                </h3>
                ${article.description ? `<p class="article-description">${this.escapeHTML(article.description.substring(0, 150))}...</p>` : ''}
            `;
            
            this.elements.bookmarksList.appendChild(bookmarkItem);
        });
    }

    updateBookmarkCount() {
        const count = Storage.get(STORAGE_KEYS.BOOKMARKS).length;
        this.elements.bookmarkCount.textContent = count;
    }

    showLoader() {
        this.elements.loader.style.display = 'block';
    }

    hideLoader() {
        this.elements.loader.style.display = 'none';
    }

    showEndMessage() {
        this.elements.endMessage.style.display = 'block';
    }

    stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DoomHygieneApp();
    });
} else {
    new DoomHygieneApp();
}

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Doomhygiene.github.io/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}
