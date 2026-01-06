// RSS Feed Configuration
// Curated feeds by language and category

const RSS_FEEDS = {
    en: [
        // Philosophy & Essays
        { url: 'https://aeon.co/feed.rss', category: 'philosophy', source: 'Aeon' },
        { url: 'https://www.brainpickings.org/feed/', category: 'essay', source: 'The Marginalian' },
        { url: 'https://philosophynow.org/rss/articles.xml', category: 'philosophy', source: 'Philosophy Now' },
        
        // Science
        { url: 'https://www.quantamagazine.org/feed/', category: 'science', source: 'Quanta Magazine' },
        { url: 'https://www.scientificamerican.com/feed/', category: 'science', source: 'Scientific American' },
        
        // Technology & Culture
        { url: 'https://www.theverge.com/rss/index.xml', category: 'technology', source: 'The Verge' },
        { url: 'https://longreads.com/feed/', category: 'culture', source: 'Longreads' },
        { url: 'https://lithub.com/feed/', category: 'literature', source: 'Literary Hub' },
        
        // Arts & History
        { url: 'https://www.theparisreview.org/blog/feed/', category: 'literature', source: 'Paris Review' },
        { url: 'https://www.historytoday.com/rss.xml', category: 'history', source: 'History Today' }
    ],
    
    de: [
        // Philosophy & Essays
        { url: 'https://www.philosophie.ch/feed', category: 'philosophy', source: 'Philosophie.ch' },
        { url: 'https://www.zeit.de/wissen/index', category: 'essay', source: 'ZEIT Wissen' },
        
        // Science
        { url: 'https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406', category: 'science', source: 'Spektrum' },
        
        // Technology & Culture
        { url: 'https://www.heise.de/rss/heise.rdf', category: 'technology', source: 'Heise' },
        { url: 'https://www.perlentaucher.de/rss/magazinrundschau.xml', category: 'culture', source: 'Perlentaucher' },
        
        // Literature
        { url: 'https://www.literaturkritik.de/literaturkritik_rss.xml', category: 'literature', source: 'Literaturkritik' }
    ],
    
    fr: [
        // Philosophy & Essays
        { url: 'https://www.philomag.com/rss.xml', category: 'philosophy', source: 'Philosophie Magazine' },
        
        // Science
        { url: 'https://www.pourlascience.fr/rss.xml', category: 'science', source: 'Pour la Science' },
        
        // Culture & Literature
        { url: 'https://www.lemonde.fr/culture/rss_full.xml', category: 'culture', source: 'Le Monde Culture' },
        { url: 'https://www.revuedesdeuxmondes.fr/feed/', category: 'literature', source: 'Revue des Deux Mondes' }
    ],
    
    es: [
        // Philosophy & Essays
        { url: 'https://ethic.es/feed/', category: 'philosophy', source: 'Ethic' },
        
        // Science
        { url: 'https://www.investigacionyciencia.es/rss', category: 'science', source: 'Investigación y Ciencia' },
        
        // Culture
        { url: 'https://www.eldiario.es/cultura/rss/', category: 'culture', source: 'elDiario.es Cultura' }
    ],
    
    it: [
        // Philosophy & Culture
        { url: 'https://www.internazionale.it/rss', category: 'culture', source: 'Internazionale' },
        
        // Science
        { url: 'https://www.lescienze.it/rss/all/rss2.0.xml', category: 'science', source: 'Le Scienze' }
    ],
    
    ja: [
        // Culture & Technology
        { url: 'https://wired.jp/feed/', category: 'technology', source: 'WIRED Japan' }
    ],
    
    ko: [
        // Technology & Culture
        { url: 'https://www.sciencetimes.co.kr/feed/', category: 'science', source: 'Science Times' }
    ],
    
    zh: [
        // Culture & Technology
        { url: 'https://cn.nytimes.com/rss.html', category: 'culture', source: 'NY Times Chinese' }
    ]
};

// CORS Proxy for RSS feeds (needed for client-side fetching)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

class FeedParser {
    constructor() {
        this.parser = new DOMParser();
    }

    async fetchFeed(feedUrl) {
        try {
            const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl));
            const text = await response.text();
            const xml = this.parser.parseFromString(text, 'text/xml');
            return this.parseXML(xml);
        } catch (error) {
            console.error(`Error fetching feed ${feedUrl}:`, error);
            return [];
        }
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

    for (const feed of feeds) {
        const items = await parser.fetchFeed(feed.url);
        const articlesWithMeta = items.map(item => ({
            ...item,
            source: feed.source,
            category: feed.category,
            id: `${feed.source}-${item.link}`.replace(/[^a-zA-Z0-9]/g, '-'),
            language: language
        }));
        allArticles.push(...articlesWithMeta);
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
