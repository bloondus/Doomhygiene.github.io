// Fast JSON API Sources (no CORS issues!)
const API_SOURCES = {
    en: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://lobste.rs/hottest.json', type: 'lobsters', category: 'technology', source: 'Lobsters' },
        { url: 'https://www.reddit.com/r/TrueReddit.json', type: 'reddit', category: 'culture', source: 'Reddit' },
        { url: 'https://www.reddit.com/r/philosophy.json', type: 'reddit', category: 'philosophy', source: 'Reddit Philosophy' },
        { url: 'https://www.reddit.com/r/science.json', type: 'reddit', category: 'science', source: 'Reddit Science' }
    ],
    
    de: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://www.reddit.com/r/de.json', type: 'reddit', category: 'culture', source: 'Reddit DE' }
    ],
    
    fr: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://www.reddit.com/r/france.json', type: 'reddit', category: 'culture', source: 'Reddit France' }
    ],
    
    es: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://www.reddit.com/r/es.json', type: 'reddit', category: 'culture', source: 'Reddit ES' }
    ],
    
    it: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://www.reddit.com/r/italy.json', type: 'reddit', category: 'culture', source: 'Reddit Italy' }
    ],
    
    ja: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    ko: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    zh: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ]
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

    parseReddit(data, source, category) {
        return data.data.children
            .filter(item => item.data.url && !item.data.is_self)
            .map(item => ({
                title: item.data.title,
                link: item.data.url,
                description: item.data.selftext?.substring(0, 200) || '',
                date: new Date(item.data.created_utc * 1000).toISOString(),
                source: source,
                category: category,
                id: `reddit-${item.data.id}`,
                points: item.data.score
            }));
    }
}


async function loadFeedsForLanguage(language) {
    const sources = API_SOURCES[language] || API_SOURCES.en;
    const parser = new FeedParser();
    const allArticles = [];
    
    console.log(`⚡ Loading ${sources.length} sources for language: ${language}`);
    const startTime = performance.now();

    // Load all sources in parallel with 3 second timeout each
    const results = await Promise.allSettled(
        sources.map(source => 
            fetch(source.url, { 
                signal: AbortSignal.timeout(3000)
            })
            .then(response => response.json())
            .then(data => ({ data, source }))
        )
    );
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const { data, source } = result.value;
            let articles = [];
            
            try {
                if (source.type === 'hn') {
                    articles = parser.parseHackerNews(data, source.source, source.category);
                } else if (source.type === 'lobsters') {
                    articles = parser.parseLobsters(data, source.source, source.category);
                } else if (source.type === 'reddit') {
                    articles = parser.parseReddit(data, source.source, source.category);
                }
                
                allArticles.push(...articles);
                console.log(`✓ Loaded ${articles.length} articles from ${source.source}`);
            } catch (error) {
                console.error(`Failed to parse ${source.source}:`, error);
            }
        } else {
            console.warn(`✗ Failed to load ${sources[index].source}:`, result.reason?.message || 'Unknown error');
        }
    });
    
    const loadTime = performance.now() - startTime;
    console.log(`✅ Total: ${allArticles.length} articles loaded in ${loadTime.toFixed(0)}ms`);
    
    if (allArticles.length === 0) {
        throw new Error('No articles could be loaded');
    }

    // Shuffle articles for mixed feed experience
    return shuffleArray(allArticles);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
