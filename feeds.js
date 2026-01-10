// Curated Quality Sources - Science, Culture, Art, Music, Research
const API_SOURCES = {
    en: [
        // Tech & Innovation
        { url: 'https://api.hnpwa.com/v0/news/1.json', type: 'hn', category: 'technology', source: 'Hacker News' },
        
        // Science & Research
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.quantamagazine.org/feed/', type: 'rss2json', category: 'science', source: 'Quanta Magazine' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/all.xml', type: 'rss2json', category: 'science', source: 'Science Daily' },
        
        // Culture & Essays
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.themarginalian.org/feed/', type: 'rss2json', category: 'culture', source: 'The Marginalian' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://lithub.com/feed/', type: 'rss2json', category: 'literature', source: 'Literary Hub' },
        
        // Art & Design
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.artnews.com/feed/', type: 'rss2json', category: 'art', source: 'ArtNews' },
        
        // Longform Journalism
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://longreads.com/feed/', type: 'rss2json', category: 'essay', source: 'Longreads' }
    ],
    
    de: [
        // Science & Research  
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406', type: 'rss2json', category: 'science', source: 'Spektrum' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.wissenschaft.de/feed/', type: 'rss2json', category: 'science', source: 'Wissenschaft.de' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.quarks.de/feed/', type: 'rss2json', category: 'science', source: 'Quarks' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://scienceblogs.de/feed/', type: 'rss2json', category: 'science', source: 'Scienceblogs' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.mpg.de/rss.xml', type: 'rss2json', category: 'science', source: 'Max-Planck' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.riffreporter.de/de/feed', type: 'rss2json', category: 'science', source: 'Riffreporter' },
        
        // Culture & News
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.spiegel.de/schlagzeilen/index.rss', type: 'rss2json', category: 'culture', source: 'SPIEGEL' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2/', type: 'rss2json', category: 'culture', source: 'Tagesschau' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.deutschlandfunk.de/die-nachrichten.353.de.rss', type: 'rss2json', category: 'culture', source: 'Deutschlandfunk' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.srf.ch/news/bnf/rss/1646', type: 'rss2json', category: 'culture', source: 'SRF' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.derstandard.at/rss', type: 'rss2json', category: 'culture', source: 'Der Standard' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.brandeins.de/feed', type: 'rss2json', category: 'culture', source: 'Brand Eins' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://uebermedien.de/feed/', type: 'rss2json', category: 'culture', source: 'Übermedien' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.republik.ch/feed', type: 'rss2json', category: 'culture', source: 'Republik' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.woz.ch/rss', type: 'rss2json', category: 'culture', source: 'WOZ' },
        
        // Literature
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.54books.de/feed/', type: 'rss2json', category: 'literature', source: '54books' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://literaturkritik.de/rss.xml', type: 'rss2json', category: 'literature', source: 'Literaturkritik' },
        
        // Music
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.musikexpress.de/feed/', type: 'rss2json', category: 'culture', source: 'Musikexpress' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://intro.de/feed', type: 'rss2json', category: 'culture', source: 'Intro' },
        
        // Tech & Digital Rights
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.heise.de/rss/heise-atom.xml', type: 'rss2json', category: 'technology', source: 'Heise' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.golem.de/rss.php?feed=ATOM1.0', type: 'rss2json', category: 'technology', source: 'Golem' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://netzpolitik.org/feed/', type: 'rss2json', category: 'technology', source: 'Netzpolitik' }
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
        // Remove dangerous tags but keep structure (p, ul, ol, li, strong, em)
        const cleaned = html
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '');
        return cleaned;
    }
}

async function loadFeedsForLanguage(language) {
    const sources = API_SOURCES[language] || API_SOURCES.en;
    const parser = new FeedParser();
    const allArticles = [];
    
    console.log(`⚡ Loading ${sources.length} sources for language: ${language}`);
    const startTime = performance.now();

    // Load all sources in parallel with 8 second timeout each
    const results = await Promise.allSettled(
        sources.map(source => 
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
                
                if (articles.length > 0) {
                    allArticles.push(...articles);
                    console.log(`✓ Loaded ${articles.length} articles from ${source.source}`);
                } else {
                    console.warn(`⚠ No articles from ${source.source}`);
                }
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
        console.error('❌ No articles loaded from any source!');
        throw new Error('No articles could be loaded. Please try again later.');
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
