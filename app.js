// Doom Hygiene - Simple & Clean
import { loadFeeds } from './feeds.js';

class App {
    constructor() {
        this.articles = [];
        this.displayed = 0;
        this.batchSize = 10;
        
        this.el = {
            loader: document.getElementById('loader'),
            articles: document.getElementById('articles'),
            endMessage: document.getElementById('end-message'),
            language: document.getElementById('language'),
            bookmarksBtn: document.getElementById('show-bookmarks'),
            closeBookmarks: document.getElementById('close-bookmarks'),
            bookmarksPanel: document.getElementById('bookmarks-panel'),
            bookmarksList: document.getElementById('bookmarks-list'),
            bookmarkCount: document.getElementById('bookmark-count'),
        };
        
        this.init();
    }
    
    async init() {
        // Load saved language
        const lang = localStorage.getItem('language') || 'de';
        this.el.language.value = lang;
        
        // Setup events
        this.el.language.addEventListener('change', () => this.changeLanguage());
        this.el.bookmarksBtn.addEventListener('click', () => this.showBookmarks());
        this.el.closeBookmarks.addEventListener('click', () => this.hideBookmarks());
        
        // Setup scroll
        window.addEventListener('scroll', () => this.onScroll());
        
        // Load articles
        await this.loadArticles();
        
        // Render first batch
        this.renderArticles();
        
        // Update bookmark count
        this.updateBookmarkCount();
    }
    
    async loadArticles() {
        this.el.loader.style.display = 'block';
        
        try {
            const lang = this.el.language.value;
            this.articles = await loadFeeds(lang);
            
            if (this.articles.length === 0) {
                throw new Error('No articles loaded');
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.el.articles.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: #666; margin-bottom: 1rem;">❌ Fehler beim Laden</p>
                    <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: var(--color-accent); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        🔄 Erneut versuchen
                    </button>
                </div>
            `;
        } finally {
            this.el.loader.style.display = 'none';
        }
    }
    
    renderArticles() {
        const batch = this.articles.slice(this.displayed, this.displayed + this.batchSize);
        
        batch.forEach(article => {
            const card = this.createCard(article);
            this.el.articles.appendChild(card);
        });
        
        this.displayed += batch.length;
        
        if (this.displayed >= this.articles.length) {
            this.el.endMessage.style.display = 'block';
        }
    }
    
    createCard(article) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.dataset.id = article.id;
        
        // Check if bookmarked
        const bookmarked = this.isBookmarked(article.id);
        
        card.innerHTML = `
            <div class="article-meta">
                <span class="article-source">${article.source}</span>
                <span class="article-category">${article.category}</span>
                <span class="article-date">${this.formatDate(article.date)}</span>
            </div>
            
            <h2 class="article-title">
                <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                    ${article.title}
                </a>
            </h2>
            
            <div class="article-description">
                ${article.description}
            </div>
            
            <div class="article-actions">
                <button class="btn btn-bookmark ${bookmarked ? 'active' : ''}" data-action="bookmark">
                    ${bookmarked ? '✓ Gespeichert' : '🔖 Speichern'}
                </button>
                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="btn">
                    Artikel lesen →
                </a>
            </div>
        `;
        
        // Add event listeners
        const bookmarkBtn = card.querySelector('[data-action="bookmark"]');
        bookmarkBtn.addEventListener('click', () => this.toggleBookmark(article, bookmarkBtn));
        
        return card;
    }
    
    toggleBookmark(article, btn) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => b.id === article.id);
        
        if (index >= 0) {
            // Remove
            bookmarks.splice(index, 1);
            btn.classList.remove('active');
            btn.textContent = '🔖 Speichern';
        } else {
            // Add
            bookmarks.push(article);
            btn.classList.add('active');
            btn.textContent = '✓ Gespeichert';
        }
        
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        this.updateBookmarkCount();
    }
    
    getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('bookmarks') || '[]');
        } catch {
            return [];
        }
    }
    
    isBookmarked(id) {
        return this.getBookmarks().some(b => b.id === id);
    }
    
    updateBookmarkCount() {
        const count = this.getBookmarks().length;
        this.el.bookmarkCount.textContent = count;
    }
    
    showBookmarks() {
        const bookmarks = this.getBookmarks();
        
        if (bookmarks.length === 0) {
            this.el.bookmarksList.innerHTML = '<p style="padding: 2rem; text-align: center; color: #666;">Keine gespeicherten Artikel</p>';
        } else {
            this.el.bookmarksList.innerHTML = '';
            bookmarks.forEach(article => {
                const item = this.createBookmarkItem(article);
                this.el.bookmarksList.appendChild(item);
            });
        }
        
        this.el.bookmarksPanel.classList.add('open');
    }
    
    createBookmarkItem(article) {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.innerHTML = `
            <div class="bookmark-content">
                <div class="bookmark-meta">
                    <span class="bookmark-source">${article.source}</span>
                    <span class="bookmark-category">${article.category}</span>
                </div>
                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="bookmark-title">
                    ${article.title}
                </a>
            </div>
            <button class="btn-remove" data-id="${article.id}" title="Entfernen">✕</button>
        `;
        
        // Add remove handler
        const removeBtn = item.querySelector('.btn-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeBookmark(article.id);
        });
        
        return item;
    }
    
    removeBookmark(id) {
        const bookmarks = this.getBookmarks();
        const filtered = bookmarks.filter(b => b.id !== id);
        localStorage.setItem('bookmarks', JSON.stringify(filtered));
        
        // Update UI
        this.updateBookmarkCount();
        this.showBookmarks();
        
        // Update button in main feed if visible
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            const btn = card.querySelector('[data-action="bookmark"]');
            if (btn) {
                btn.classList.remove('active');
                btn.textContent = '🔖 Speichern';
            }
        }
    }
    
    hideBookmarks() {
        this.el.bookmarksPanel.classList.remove('open');
    }
    
    async changeLanguage() {
        const lang = this.el.language.value;
        localStorage.setItem('language', lang);
        
        // Reset
        this.articles = [];
        this.displayed = 0;
        this.el.articles.innerHTML = '';
        this.el.endMessage.style.display = 'none';
        
        // Reload
        await this.loadArticles();
        this.renderArticles();
    }
    
    onScroll() {
        const scrollY = window.scrollY + window.innerHeight;
        const height = document.documentElement.scrollHeight;
        
        if (scrollY >= height - 500 && this.displayed < this.articles.length) {
            this.renderArticles();
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        
        if (hours < 24) return `vor ${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `vor ${days}d`;
        
        return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
    }
}

// Start app
new App();
