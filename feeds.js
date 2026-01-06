// Curated Quality Sources - Science, Culture, Art, Music, Research
const API_SOURCES = {
    en: [
        // Tech & Innovation
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://lobste.rs/hottest.json', type: 'lobsters', category: 'technology', source: 'Lobsters' },
        
        // Science & Research
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.quantamagazine.org/feed/', type: 'rss2json', category: 'science', source: 'Quanta Magazine' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/all.xml', type: 'rss2json', category: 'science', source: 'Science Daily' },
        
        // Culture & Essays
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://aeon.co/feed/essays', type: 'rss2json', category: 'philosophy', source: 'Aeon' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.themarginalian.org/feed/', type: 'rss2json', category: 'culture', source: 'The Marginalian' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://lithub.com/feed/', type: 'rss2json', category: 'literature', source: 'Literary Hub' },
        
        // Art & Design
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.itsnicethat.com/feed', type: 'rss2json', category: 'art', source: "It's Nice That" },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.artnews.com/feed/', type: 'rss2json', category: 'art', source: 'ArtNews' },
        
        // Music & Culture
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://pitchfork.com/rss/reviews/albums/', type: 'rss2json', category: 'culture', source: 'Pitchfork' },
        
        // Longform Journalism
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://longreads.com/feed/', type: 'rss2json', category: 'essay', source: 'Longreads' }
    ],
    
    de: [
        // Science & Research
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406', type: 'rss2json', category: 'science', source: 'Spektrum' },
        
        // Culture & Essays
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.perlentaucher.de/rss/magazinrundschau.xml', type: 'rss2json', category: 'culture', source: 'Perlentaucher' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.zeit.de/wissen/index', type: 'rss2json', category: 'culture', source: 'ZEIT Wissen' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.faz.net/rss/aktuell/feuilleton/', type: 'rss2json', category: 'culture', source: 'FAZ Feuilleton' },
        
        // Art
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.monopol-magazin.de/rss.xml', type: 'rss2json', category: 'art', source: 'Monopol' },
        
        // Tech
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    fr: [
        // Culture & Science
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.lemonde.fr/culture/rss_full.xml', type: 'rss2json', category: 'culture', source: 'Le Monde Culture' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencesetavenir.fr/rss.xml', type: 'rss2json', category: 'science', source: 'Sciences et Avenir' },
        
        // Art
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.beauxarts.com/feed/', type: 'rss2json', category: 'art', source: 'Beaux Arts' },
        
        // Tech
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    es: [
        // Culture & Science
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://elpais.com/rss/cultura/portada.xml', type: 'rss2json', category: 'culture', source: 'El País Cultura' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.agenciasinc.es/RSS', type: 'rss2json', category: 'science', source: 'SINC' },
        
        // Tech
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    it: [
        // Culture & Science
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.repubblica.it/rss/cultura/rss2.0.xml', type: 'rss2json', category: 'culture', source: 'Repubblica Cultura' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml', type: 'rss2json', category: 'culture', source: 'ANSA Cultura' },
        
        // Tech
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    ja: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www3.nhk.or.jp/rss/news/cat0.xml', type: 'rss2json', category: 'culture', source: 'NHK' }
    ],
    
    ko: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' }
    ],
    
    zh: [
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://cn.nytimes.com/rss.html', type: 'rss2json', category: 'culture', source: 'NY Times Chinese' }
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

    parseRSS2JSON(data, source, category) {
        if (!data.items) return [];
        
        return data.items.map((item, index) => ({
            title: item.title,
            link: item.link,
            description: item.description?.replace(/<[^>]*>/g, '').substring(0, 300) || item.content?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
            date: item.pubDate || new Date().toISOString(),
            source: source,
            category: category,
            id: `${source.toLowerCase().replace(/\s+/g, '-')}-${index}`,
            author: item.author || ''
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
                } else if (source.type === 'rss2json') {
                    articles = parser.parseRSS2JSON(data, source.source, source.category);
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
