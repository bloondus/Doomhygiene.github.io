// Local Storage Management
const STORAGE_KEYS = {
    LIKES: 'doomhygiene_likes',
    BOOKMARKS: 'doomhygiene_bookmarks',
    READ: 'doomhygiene_read',
    LANGUAGE: 'doomhygiene_language'
};

const Storage = {
    // Get items from storage
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    // Set items in storage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },

    // Add item to a set
    add(key, itemId) {
        const items = this.get(key);
        if (!items.includes(itemId)) {
            items.push(itemId);
            this.set(key, items);
        }
    },

    // Remove item from a set
    remove(key, itemId) {
        const items = this.get(key);
        const filtered = items.filter(id => id !== itemId);
        this.set(key, filtered);
    },

    // Check if item exists in a set
    has(key, itemId) {
        const items = this.get(key);
        return items.includes(itemId);
    },

    // Toggle item in a set
    toggle(key, itemId) {
        if (this.has(key, itemId)) {
            this.remove(key, itemId);
            return false;
        } else {
            this.add(key, itemId);
            return true;
        }
    },

    // Get all bookmarked articles with their data
    getBookmarkedArticles() {
        try {
            const bookmarksData = localStorage.getItem('doomhygiene_bookmarks_data');
            return bookmarksData ? JSON.parse(bookmarksData) : {};
        } catch (error) {
            console.error('Error reading bookmarks data:', error);
            return {};
        }
    },

    // Save bookmarked article data
    saveBookmarkedArticle(article) {
        try {
            const bookmarksData = this.getBookmarkedArticles();
            bookmarksData[article.id] = {
                id: article.id,
                title: article.title,
                link: article.link,
                description: article.description,
                source: article.source,
                category: article.category,
                date: article.date,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('doomhygiene_bookmarks_data', JSON.stringify(bookmarksData));
        } catch (error) {
            console.error('Error saving bookmark data:', error);
        }
    },

    // Remove bookmarked article data
    removeBookmarkedArticle(articleId) {
        try {
            const bookmarksData = this.getBookmarkedArticles();
            delete bookmarksData[articleId];
            localStorage.setItem('doomhygiene_bookmarks_data', JSON.stringify(bookmarksData));
        } catch (error) {
            console.error('Error removing bookmark data:', error);
        }
    }
};
