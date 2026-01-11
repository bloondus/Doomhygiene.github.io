// Main Application Logic
class DoomHygieneApp {
    constructor() {
        this.articles = [];
        this.displayedArticles = 0;
        this.isLoading = false;
        this.hasMoreArticles = true;
        this.observer = null;
        this.loadMoreTimeout = null;
        
        this.elements = {
            articlesContainer: document.getElementById('articles'),
            loader: document.getElementById('loader'),
            endMessage: document.getElementById('end-message'),
            languageSelector: document.getElementById('language'),
            bookmarksPanel: document.getElementById('bookmarks-panel'),
            bookmarksList: document.getElementById('bookmarks-list'),
            showBookmarksBtn: document.getElementById('show-bookmarks'),
            closeBookmarksBtn: document.getElementById('close-bookmarks'),
            bookmarkCount: document.getElementById('bookmark-count'),
            startupLoader: document.getElementById('startup-loader'),
            appContainer: document.getElementById('app-container'),
            progressFill: document.getElementById('progress-fill'),
            startupStatus: document.getElementById('startup-status'),
            startupDetails: document.getElementById('startup-details'),
            loadingTip: document.getElementById('loading-tip')
        };
        
        this.init();
    }

    async init() {
        // Show startup screen with random tip
        this.showStartupScreen();
        
        // Load saved language preference
        const savedLanguage = Storage.get(STORAGE_KEYS.LANGUAGE)[0] || 'de';
        this.elements.languageSelector.value = savedLanguage;
        setLanguage(savedLanguage);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial articles with progress
        await this.loadArticles();
        this.renderArticles();
        
        // Update bookmark count
        this.updateBookmarkCount();
        
        // Hide startup screen, show app
        this.hideStartupScreen();
    }
    
    showStartupScreen() {
        const tips = [
            '💡 Mit ❤️ kannst du Artikel für später markieren',
            '💡 🔖 speichert Artikel in deiner persönlichen Sammlung',
            '💡 Wische nach unten für endlosen Content',
            '💡 Wechsle die Sprache für andere Perspektiven',
            '💡 Alle Daten bleiben lokal - kein Tracking!',
            '💡 Funktioniert auch offline dank Cache',
            '💡 ○ markiert gelesene Artikel automatisch',
            '💡 Longform-Artikel direkt in der App lesen',
        ];
        
        const facts = [
            'Doom Hygiene lädt Artikel von 16+ Quellen',
            'Alle Inhalte sind werbefrei und tracker-frei',
            'Open Source auf GitHub verfügbar',
            'Fokus auf Essays, Analysen und Tiefgang',
            'Alternative Medien statt Mainstream-Teaser',
            'Privacy-first: Keine Cookies, keine Accounts',
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        
        this.elements.loadingTip.textContent = randomTip;
        document.getElementById('fact-text').textContent = randomFact;
        
        // Tip Rotation alle 3 Sekunden
        this.tipRotation = setInterval(() => {
            const newTip = tips[Math.floor(Math.random() * tips.length)];
            const tipElement = this.elements.loadingTip;
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = newTip;
                tipElement.style.opacity = '1';
            }, 300);
        }, 3000);
    }
    
    hideStartupScreen() {
        clearInterval(this.tipRotation);
        
        this.elements.startupLoader.classList.add('fade-out');
        
        setTimeout(() => {
            this.elements.startupLoader.style.display = 'none';
            this.elements.appContainer.style.opacity = '1';
            this.elements.appContainer.style.transition = 'opacity 0.5s ease-in';
        }, 800);
    }
    
    updateProgress(progress) {
        this.elements.progressFill.style.width = `${progress.percentage}%`;
        document.getElementById('progress-percentage').textContent = `${progress.percentage}%`;
        
        // Dynamische Status-Messages
        let message = progress.status;
        if (progress.percentage < 30) {
            message = 'Verbindet mit Quellen...';
        } else if (progress.percentage < 70) {
            message = 'Lädt Artikel...';
        } else if (progress.percentage < 100) {
            message = 'Fast fertig...';
        } else {
            message = '✨ Bereit!';
        }
        
        document.getElementById('status-text').textContent = message;
        this.elements.startupDetails.textContent = `${progress.loaded} von ${progress.total} Quellen geladen`;
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
            let appStarted = false;
            
            const articles = await loadFeedsForLanguage(language, (progress) => {
                // Update loading screen progress
                if (this.elements.progressFill) {
                    this.updateProgress(progress);
                }
                
                // PHASE 1 COMPLETE: Start app immediately with first batch
                if (progress.articles && !progress.complete && !appStarted) {
                    console.log(`🚀 Starting app with ${progress.articles.length} articles from Phase 1`);
                    this.articles = progress.articles;
                    this.hasMoreArticles = true;
                    this.elements.articlesContainer.innerHTML = '';
                    this.renderArticles();
                    this.hideStartupScreen();
                    appStarted = true;
                }
                
                // PHASE 2 COMPLETE: Add more articles in background
                if (progress.articles && progress.complete) {
                    console.log(`➕ Adding ${progress.articles.length} more articles from Phase 2`);
                    this.articles.push(...progress.articles);
                    
                    // Show notification
                    this.showNotification(`${progress.articles.length} neue Artikel geladen!`);
                }
            });
            
            // Fallback: If phase 1 callback didn't fire, use returned articles
            if (!appStarted && articles && articles.length > 0) {
                this.articles = articles;
                this.hasMoreArticles = true;
                this.elements.articlesContainer.innerHTML = '';
                this.renderArticles();
            }
            
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
            this.displayedArticles + 5  // Reduced from 10 to 5 for smoother scrolling
        );

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        articlesToRender.forEach(article => {
            const articleElement = this.createArticleElement(article);
            fragment.appendChild(articleElement);
        });

        // Batch DOM update with requestAnimationFrame
        requestAnimationFrame(() => {
            this.elements.articlesContainer.appendChild(fragment);
            this.displayedArticles += articlesToRender.length;

            if (this.displayedArticles >= this.articles.length) {
                this.hasMoreArticles = false;
                this.showEndMessage();
            }
            
            // Setup intersection observer for lazy loading
            this.setupLazyLoading();
        });
    }
    
    setupLazyLoading() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMoreArticles && !this.isLoading) {
                    // Debounce: Only load more after 200ms to prevent rapid re-renders
                    if (this.loadMoreTimeout) clearTimeout(this.loadMoreTimeout);
                    this.loadMoreTimeout = setTimeout(() => {
                        this.renderArticles();
                    }, 200);
                }
            });
        }, { 
            rootMargin: '800px',  // Load earlier to prevent white space
            threshold: 0.1        // Trigger at 10% visibility
        });
        
        // Observe last 3 articles for smoother loading
        const articles = this.elements.articlesContainer.querySelectorAll('.article-card');
        const lastThree = Array.from(articles).slice(-3);
        lastThree.forEach(article => {
            this.observer.observe(article);
        });
    }

    createArticleElement(article) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.dataset.articleId = article.id;
        
        // Add will-change for better scroll performance
        card.style.willChange = 'transform';

        // Check if article is read
        if (Storage.has(STORAGE_KEYS.READ, article.id)) {
            card.classList.add('read');
        }

        // Show full content with HTML structure
        const description = article.fullContent || article.description || '';

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
            
            ${description ? `<div class="article-description article-content">${description}</div>` : ''}
            
            <div class="article-actions">
                <button class="action-btn like ${Storage.has(STORAGE_KEYS.LIKES, article.id) ? 'active' : ''}" 
                        data-action="like" data-id="${article.id}" title="${t('like')}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.LIKES, article.id) ? '❤️' : '🤍'}</span>
                </button>
                
                <button class="action-btn bookmark ${Storage.has(STORAGE_KEYS.BOOKMARKS, article.id) ? 'active' : ''}" 
                        data-action="bookmark" data-id="${article.id}" title="${t('bookmark')}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.BOOKMARKS, article.id) ? '🔖' : '📑'}</span>
                </button>
                
                <button class="action-btn read ${Storage.has(STORAGE_KEYS.READ, article.id) ? 'active' : ''}" 
                        data-action="read" data-id="${article.id}" title="${t('markAsRead')}">
                    <span class="icon">${Storage.has(STORAGE_KEYS.READ, article.id) ? '✓' : '○'}</span>
                </button>
                
                <a href="${this.escapeHTML(article.link)}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                    ${t('readMore')} →
                </a>
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
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
// DISABLED: Causing errors with Response conversion
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/Doomhygiene.github.io/sw.js')
//             .then(registration => {
//                 console.log('✅ Service Worker registered:', registration.scope);
//             })
//             .catch(error => {
//                 console.log('❌ Service Worker registration failed:', error);
//             });
//     });
// }
