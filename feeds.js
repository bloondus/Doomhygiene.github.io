// Only 10/10 World-Class Sources - No Paywall
// Focus: Investigative journalism, academic essays, science

const SOURCES = {
    de: [
        // 10/10 - Top German Sources - No Paywall
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://netzpolitik.org/feed/', source: 'Netzpolitik.org', category: 'Tech' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://geschichtedergegenwart.ch/feed/', source: 'Geschichte der Gegenwart', category: 'Geschichte' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://correctiv.org/feed/', source: 'Correctiv', category: 'Recherche' },
        // Swiss Sources - No Paywall
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.infosperber.ch/feed/', source: 'Infosperber', category: 'Recherche' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.woz.ch/rss/artikel', source: 'WOZ', category: 'Politik' },
    ],
    
    en: [
        // 10/10 - World-Class English Sources
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://aeon.co/feed/essays', source: 'Aeon', category: 'Philosophy' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.themarginalian.org/feed/', source: 'The Marginalian', category: 'Culture' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.quantamagazine.org/feed/', source: 'Quanta Magazine', category: 'Science' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.propublica.org/feeds/propublica/main', source: 'ProPublica', category: 'Investigation' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://theintercept.com/feed/', source: 'The Intercept', category: 'Investigation' },
    ],
    
    fr: [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://reporterre.net/spip.php?page=backend', source: 'Reporterre', category: 'Écologie' },
    ],
    
    es: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', source: 'Hacker News', category: 'Tech', type: 'hn' },
    ],
};

// Load feeds for a language
export async function loadFeeds(language = 'de') {
    const sources = SOURCES[language] || SOURCES.de;
    const articles = [];
    
    console.log(`📰 Loading ${sources.length} sources for ${language}...`);
    
    // Load all sources in parallel
    const promises = sources.map(async (source) => {
        try {
            const response = await fetch(source.url, {
                signal: AbortSignal.timeout(8000)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            // Parse based on type
            if (source.type === 'hn') {
                return parseHackerNews(data, source);
            } else {
                return parseRSS2JSON(data, source);
            }
        } catch (error) {
            console.warn(`✗ Failed to load ${source.source}:`, error.message);
            return [];
        }
    });
    
    const results = await Promise.all(promises);
    
    // Flatten and shuffle
    results.forEach(items => articles.push(...items));
    
    console.log(`✅ Loaded ${articles.length} articles`);
    
    return shuffle(articles);
}

// Parse RSS2JSON format
function parseRSS2JSON(data, source) {
    if (!data.items || !Array.isArray(data.items)) return [];
    
    return data.items.slice(0, 10).map((item, index) => ({
        id: `${source.source}-${index}-${Date.now()}`,
        title: item.title || 'Untitled',
        link: item.link || item.guid || '#',
        description: sanitize(item.content || item.description || ''),
        date: item.pubDate || new Date().toISOString(),
        source: source.source,
        category: source.category,
    }));
}

// Parse Hacker News format
function parseHackerNews(data, source) {
    if (!Array.isArray(data)) return [];
    
    return data.slice(0, 20).map((item) => ({
        id: `hn-${item.id}`,
        title: item.title || 'Untitled',
        link: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        description: item.domain ? `${item.domain} • ${item.points || 0} points` : '',
        date: new Date(item.time * 1000).toISOString(),
        source: source.source,
        category: source.category,
    }));
}

// Sanitize HTML with DOMPurify
function sanitize(html) {
    if (typeof DOMPurify === 'undefined') return html;
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
}

// Fisher-Yates shuffle
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
