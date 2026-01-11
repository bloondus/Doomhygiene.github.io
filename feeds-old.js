// Free & Independent Media - Full Articles or Substantial Summaries
// NO TEASERS - Only sources with complete content or full summaries (200+ words)
// Phase 1: Priority sources (fast loading)
// Phase 2: Secondary sources (background loading)

const PRIORITY_SOURCES = {
    de: [
        // ✅ Voller Artikel-Text im Feed
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://netzpolitik.org/feed/', type: 'rss2json', category: 'technology', source: 'Netzpolitik.org' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.nachdenkseiten.de/?feed=atom', type: 'rss2json', category: 'politics', source: 'NachDenkSeiten' },
    ],
    
    en: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://aeon.co/feed/essays', type: 'rss2json', category: 'philosophy', source: 'Aeon' },
    ],
    
    fr: [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://reporterre.net/spip.php?page=backend', type: 'rss2json', category: 'environment', source: 'Reporterre' },
    ],
    
    es: [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://ctxt.es/rss.xml', type: 'rss2json', category: 'culture', source: 'CTXT' },
    ],
    
    it: [{ url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }],
    ja: [{ url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }],
    ko: [{ url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }],
    zh: [{ url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }],
};

const SECONDARY_SOURCES = {
    de: [
        // ✅ Vollständige Zusammenfassungen (300-500 Wörter) oder voller Text
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.freitag.de/@@RSS', type: 'rss2json', category: 'essay', source: 'Der Freitag' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://geschichtedergegenwart.ch/feed/', type: 'rss2json', category: 'history', source: 'Geschichte der Gegenwart' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.heise.de/tp/rss/news.xml', type: 'rss2json', category: 'technology', source: 'Telepolis' },
    ],
    
    en: [
        // ✅ Voller Artikel-Text (2000-5000+ Wörter!)
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.themarginalian.org/feed/', type: 'rss2json', category: 'culture', source: 'The Marginalian' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.quantamagazine.org/feed/', type: 'rss2json', category: 'science', source: 'Quanta Magazine' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://longreads.com/feed/', type: 'rss2json', category: 'essay', source: 'Longreads' },
    ],
    
    fr: [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.lemonde-diplomatique.fr/rss', type: 'rss2json', category: 'politics', source: 'Le Monde Diplomatique' },
    ],
    
    es: [],
    it: [],
    ja: [],
    ko: [],
    zh: [],
};

class FeedParser {
    parseHackerNews(data, source, category) {
        return data.map(item => ({
            title: item.title,
            link: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            description: item.domain || '',
            date: new Date(item.time * 1000).toISOString(),
            source: source,
            category: category,
            id: `hn-${item.id}`,
            points: item.points
        }));
    }

    parseLobsters(data, source, category) {
        return data.map(item => ({
            title: item.title,
            link: item.url,
            description: item.description || item.tags?.join(', ') || '',
            date: item.created_at,
            source: source,
            category: category,
            id: `lobsters-${item.short_id}`,
            points: item.score
        }));
    }

    parseRSS2JSON(data, source, category) {
        if (!data.items) return [];
        
        return data.items.map((item, index) => ({
            title: item.title,
            link: item.link,
            description: this.cleanHTML(item.content || item.description || ''),
            fullContent: item.content || item.description || '',
            date: item.pubDate || new Date().toISOString(),
            source: source,
            category: category,
            id: `${source.toLowerCase().replace(/\s+/g, '-')}-${index}`,
            author: item.author || ''
        }));
    }
    
    cleanHTML(html) {
        if (!html) return '';
        
        // Use DOMPurify for professional HTML sanitization
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'em', 'b', 'i', 'a', 
                    'ul', 'ol', 'li', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'blockquote', 'code', 'pre', 'hr', 'span', 'div'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
                ALLOW_DATA_ATTR: false,
                FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'style', 'form', 'input'],
                FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
                ADD_ATTR: ['target'],
                SAFE_FOR_TEMPLATES: true
            });
        }
        
        // Fallback: Basic manual sanitization if DOMPurify not loaded
        return html
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/<object[^>]*>.*?<\/object>/gi, '')
            .replace(/<embed[^>]*>/gi, '')
            .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
            .replace(/on\w+\s*=\s*'[^']*'/gi, '')
            .replace(/javascript:/gi, '');
    }
}

async function loadFeedsForLanguage(language, onProgress = null) {
    const prioritySources = PRIORITY_SOURCES[language] || PRIORITY_SOURCES.en;
    const secondarySources = SECONDARY_SOURCES[language] || SECONDARY_SOURCES.en;
    const parser = new FeedParser();
    
    console.log(`⚡ PHASE 1: Loading ${prioritySources.length} priority sources for ${language}`);
    const startTime = performance.now();
    
    // Initial Progress
    if (onProgress) {
        onProgress({
            total: prioritySources.length + secondarySources.length,
            loaded: 0,
            status: 'Verbinde mit Quellen...',
            percentage: 0,
            phase: 1
        });
    }

    // PHASE 1: Load priority sources (fast, ~3-5s)
    const priorityArticles = await loadSourceBatch(
        prioritySources, 
        parser, 
        onProgress, 
        0, 
        50,
        prioritySources.length + secondarySources.length,
        'priority'
    );
    
    const phase1Time = performance.now() - startTime;
    console.log(`✅ PHASE 1 DONE: ${priorityArticles.length} articles in ${phase1Time.toFixed(0)}ms`);
    
    // Return Phase 1 articles immediately so app can start
    if (onProgress) {
        onProgress({
            total: prioritySources.length + secondarySources.length,
            loaded: prioritySources.length,
            status: 'App bereit!',
            percentage: 50,
            phase: 1,
            articles: shuffleArray(priorityArticles),
            complete: false
        });
    }
    
    // PHASE 2: Load secondary sources in background (slower, ~30-90s)
    console.log(`🔄 PHASE 2: Loading ${secondarySources.length} secondary sources in background...`);
    
    // Small delay before Phase 2 starts
    setTimeout(async () => {
        const secondaryArticles = await loadSourceBatch(
            secondarySources,
            parser,
            onProgress,
            50,
            100,
            prioritySources.length + secondarySources.length,
            'secondary'
        );
        
        const totalTime = performance.now() - startTime;
        console.log(`✅ PHASE 2 DONE: ${secondaryArticles.length} more articles in ${totalTime.toFixed(0)}ms total`);
        
        // Notify about new articles loaded
        if (onProgress) {
            onProgress({
                total: prioritySources.length + secondarySources.length,
                loaded: prioritySources.length + secondarySources.length,
                status: 'Alle Artikel geladen!',
                percentage: 100,
                phase: 2,
                articles: shuffleArray(secondaryArticles),
                complete: true
            });
        }
    }, 100);
    
    // Return Phase 1 articles immediately
    return priorityArticles;
}

async function loadSourceBatch(sources, parser, onProgress, startPercentage, endPercentage, totalSources, phase) {
    const allArticles = [];
    const CHUNK_SIZE = 3;
    let loadedInBatch = 0;
    
    for (let i = 0; i < sources.length; i += CHUNK_SIZE) {
        const chunk = sources.slice(i, i + CHUNK_SIZE);
        
        const results = await Promise.allSettled(
            chunk.map((source) => 
                fetch(source.url, { 
                    signal: AbortSignal.timeout(8000)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => ({ data, source }))
            )
        );
        
        results.forEach((result, chunkIndex) => {
            if (result.status === 'fulfilled') {
                const { data, source } = result.value;
                let articles = [];
                
                try {
                    if (source.type === 'hn') {
                        articles = parser.parseHackerNews(data, source.source, source.category);
                    } else if (source.type === 'rss2json') {
                        articles = parser.parseRSS2JSON(data, source.source, source.category);
                    }
                    
                    if (articles.length > 0) {
                        allArticles.push(...articles);
                        console.log(`✓ [${phase}] Loaded ${articles.length} articles from ${source.source}`);
                    }
                } catch (error) {
                    console.error(`Failed to parse ${source.source}:`, error);
                }
            } else {
                const sourceIndex = i + chunkIndex;
                if (sourceIndex < sources.length) {
                    console.warn(`✗ [${phase}] Failed to load ${sources[sourceIndex].source}:`, result.reason?.message || 'Unknown error');
                }
            }
            
            loadedInBatch++;
            
            // Calculate progress within the batch's percentage range
            const progress = startPercentage + (loadedInBatch / sources.length) * (endPercentage - startPercentage);
            
            if (onProgress) {
                onProgress({
                    total: totalSources,
                    loaded: (phase === 'priority' ? loadedInBatch : sources.length + loadedInBatch),
                    status: phase === 'priority' ? 'Lädt Artikel...' : 'Lädt mehr Artikel...',
                    percentage: Math.round(progress),
                    phase: phase === 'priority' ? 1 : 2
                });
            }
        });
        
        // Small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return allArticles;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
