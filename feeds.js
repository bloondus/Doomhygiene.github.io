// RSS Feed Configuration
// Curated feeds by language and category

const RSS_FEEDS = {
    en: [
        // Philosophy & Essays
        { url: 'https://feeds.aeon.co/aeon', category: 'philosophy', source: 'Aeon' },
        { url: 'https://www.themarginalian.org/feed/', category: 'essay', source: 'The Marginalian' },
        { url: 'https://longreads.com/feed/', category: 'culture', source: 'Longreads' },
        
        // Science
        { url: 'https://www.quantamagazine.org/feed/', category: 'science', source: 'Quanta Magazine' },
        { url: 'http://rss.sciam.com/ScientificAmerican-Global', category: 'science', source: 'Scientific American' },
        { url: 'https://nautil.us/feed/', category: 'science', source: 'Nautilus' },
        
        // Technology & Culture
        { url: 'https://www.theverge.com/rss/index.xml', category: 'technology', source: 'The Verge' },
        { url: 'https://www.wired.com/feed/rss', category: 'technology', source: 'WIRED' },
        { url: 'https://www.newyorker.com/feed/everything', category: 'culture', source: 'The New Yorker' },
        
        // Arts & History
        { url: 'https://lithub.com/feed/', category: 'literature', source: 'Literary Hub' },
        { url: 'https://www.theparisreview.org/blog/feed/', category: 'literature', source: 'Paris Review' }
    ],
    
    de: [
        // Science & Culture
        { url: 'https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406', category: 'science', source: 'Spektrum' },
        { url: 'https://www.heise.de/rss/heise-atom.xml', category: 'technology', source: 'Heise' },
        { url: 'https://www.zeit.de/index', category: 'culture', source: 'ZEIT Online' },
        { url: 'https://www.spiegel.de/schlagzeilen/index.rss', category: 'culture', source: 'SPIEGEL' },
        { url: 'https://www.sueddeutsche.de/news/rss', category: 'culture', source: 'Süddeutsche' },
        
        // Literature & Philosophy
        { url: 'https://www.perlentaucher.de/rss/magazinrundschau.xml', category: 'literature', source: 'Perlentaucher' }
    ],
    
    fr: [
        // Culture & Science
        { url: 'https://www.lemonde.fr/rss/une.xml', category: 'culture', source: 'Le Monde' },
        { url: 'https://www.courrierinternational.com/feed/all/rss.xml', category: 'culture', source: 'Courrier International' },
        { url: 'https://www.liberation.fr/arc/outboundfeeds/rss/', category: 'culture', source: 'Libération' }
    ],
    
    es: [
        // Culture & Science
        { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', category: 'culture', source: 'El País' },
        { url: 'https://www.lavanguardia.com/rss/home.xml', category: 'culture', source: 'La Vanguardia' }
    ],
    
    it: [
        // Culture & Science
        { url: 'https://www.internazionale.it/rss', category: 'culture', source: 'Internazionale' },
        { url: 'https://www.lescienze.it/rss/all/rss2.0.xml', category: 'science', source: 'Le Scienze' }
    ],
    
    ja: [
        // Technology & Culture
        { url: 'https://wired.jp/feed/', category: 'technology', source: 'WIRED Japan' },
        { url: 'https://www3.nhk.or.jp/rss/news/cat0.xml', category: 'culture', source: 'NHK' }
    ],
    
    ko: [
        // Science & Culture
        { url: 'https://www.hani.co.kr/rss/', category: 'culture', source: 'Hankyoreh' }
    ],
    
    zh: [
        // Culture & Technology
        { url: 'https://cn.nytimes.com/rss.html', category: 'culture', source: 'NY Times Chinese' }
    ]
};

// CORS Proxy - mit Fallback-Option
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
];

let currentProxyIndex = 0;

class FeedParser {
    constructor() {
        this.parser = new DOMParser();
    }

    async fetchFeed(feedUrl) {
        // Versuche zuerst ohne Proxy
        try {
            const response = await fetch(feedUrl);
            if (response.ok) {
                const text = await response.text();
                const xml = this.parser.parseFromString(text, 'text/xml');
                const articles = this.parseXML(xml);
                if (articles.length > 0) {
                    console.log(`✓ Loaded ${articles.length} articles from ${feedUrl}`);
                    return articles;
                }
            }
        } catch (error) {
            console.log(`Direct fetch failed for ${feedUrl}, trying with proxy...`);
        }

        // Wenn direkter Zugriff fehlschlägt, versuche mit Proxy
        for (let i = 0; i < CORS_PROXIES.length; i++) {
            try {
                const proxyUrl = CORS_PROXIES[i] + encodeURIComponent(feedUrl);
                console.log(`Trying proxy ${i + 1}/${CORS_PROXIES.length} for ${feedUrl}`);
                
                const response = await fetch(proxyUrl);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const text = await response.text();
                const xml = this.parser.parseFromString(text, 'text/xml');
                const articles = this.parseXML(xml);
                
                if (articles.length > 0) {
                    console.log(`✓ Loaded ${articles.length} articles via proxy from ${feedUrl}`);
                    return articles;
                }
            } catch (error) {
                console.error(`Proxy ${i + 1} failed for ${feedUrl}:`, error.message);
            }
        }
        
        console.error(`All attempts failed for ${feedUrl}`);
        return [];
    }

    parseXML(xml) {
        const items = [];
        const entries = xml.querySelectorAll('item, entry');

        entries.forEach(entry => {
            const item = {
                title: this.getElementText(entry, 'title'),
                link: this.getElementText(entry, 'link') || entry.querySelector('link')?.getAttribute('href'),
                description: this.getElementText(entry, 'description, summary, content\\:encoded'),
                date: this.getElementText(entry, 'pubDate, published, updated'),
                author: this.getElementText(entry, 'author, dc\\:creator')
            };

            if (item.title && item.link) {
                items.push(item);
            }
        });

        return items;
    }

    getElementText(parent, selectors) {
        const element = parent.querySelector(selectors);
        return element?.textContent?.trim() || '';
    }

    cleanDescription(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.trim().substring(0, 300) + '...';
    }
}

async function loadFeedsForLanguage(language) {
    const feeds = RSS_FEEDS[language] || RSS_FEEDS.en;
    const parser = new FeedParser();
    const allArticles = [];
    
    console.log(`Loading ${feeds.length} feeds for language: ${language}`);

    //Lade alle Feeds parallel (aber mit Limit von 3 gleichzeitig)
    const batchSize = 3;
    for (let i = 0; i < feeds.length; i += batchSize) {
        const batch = feeds.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async feed => {
                try {
                    const items = await parser.fetchFeed(feed.url);
                    return items.map(item => ({
                        ...item,
                        source: feed.source,
                        category: feed.category,
                        id: `${feed.source}-${item.link}`.replace(/[^a-zA-Z0-9]/g, '-'),
                        language: language
                    }));
                } catch (error) {
                    console.error(`Failed to load ${feed.source}:`, error);
                    return [];
                }
            })
        );
        
        results.forEach(articles => {
            allArticles.push(...articles);
        });
        
        console.log(`Loaded batch ${Math.floor(i / batchSize) + 1}, total articles: ${allArticles.length}`);
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
