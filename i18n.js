// Internationalization
const i18n = {
    en: {
        tagline: 'Scroll with substance',
        selectLanguage: 'Language:',
        endOfFeed: "You've reached the end. Time to reflect.",
        bookmarks: 'Bookmarks',
        like: 'Like',
        bookmark: 'Bookmark',
        markAsRead: 'Mark as read',
        readMore: 'Read more',
        noBookmarks: 'No bookmarks yet. Start saving articles you want to read later.',
        categories: {
            philosophy: 'Philosophy',
            science: 'Science',
            technology: 'Technology',
            culture: 'Culture',
            essay: 'Essay',
            literature: 'Literature',
            art: 'Art',
            history: 'History'
        }
    },
    de: {
        tagline: 'Scrollen mit Substanz',
        selectLanguage: 'Sprache:',
        endOfFeed: 'Du hast das Ende erreicht. Zeit zum Nachdenken.',
        bookmarks: 'Lesezeichen',
        like: 'Gefällt mir',
        bookmark: 'Merken',
        markAsRead: 'Als gelesen markieren',
        readMore: 'Weiterlesen',
        noBookmarks: 'Noch keine Lesezeichen. Speichere Artikel, die du später lesen möchtest.',
        categories: {
            philosophy: 'Philosophie',
            science: 'Wissenschaft',
            technology: 'Technologie',
            culture: 'Kultur',
            essay: 'Essay',
            literature: 'Literatur',
            art: 'Kunst',
            history: 'Geschichte'
        }
    },
    fr: {
        tagline: 'Défilement avec substance',
        selectLanguage: 'Langue:',
        endOfFeed: "Vous avez atteint la fin. C'est le moment de réfléchir.",
        bookmarks: 'Favoris',
        like: "J'aime",
        bookmark: 'Sauvegarder',
        markAsRead: 'Marquer comme lu',
        noBookmarks: 'Pas encore de favoris. Commencez à sauvegarder des articles.',
        readMore: 'Lire la suite',
        categories: {
            philosophy: 'Philosophie',
            science: 'Science',
            technology: 'Technologie',
            culture: 'Culture',
            essay: 'Essai',
            literature: 'Littérature',
            art: 'Art',
            history: 'Histoire'
        }
    },
    es: {
        tagline: 'Desplazamiento con sustancia',
        selectLanguage: 'Idioma:',
        endOfFeed: 'Has llegado al final. Tiempo para reflexionar.',
        bookmarks: 'Marcadores',
        like: 'Me gusta',
        bookmark: 'Guardar',
        markAsRead: 'Marcar como leído',
        noBookmarks: 'Aún no hay marcadores. Empieza a guardar artículos.',
        readMore: 'Leer más',
        categories: {
            philosophy: 'Filosofía',
            science: 'Ciencia',
            technology: 'Tecnología',
            culture: 'Cultura',
            essay: 'Ensayo',
            literature: 'Literatura',
            art: 'Arte',
            history: 'Historia'
        }
    },
    it: {
        tagline: 'Scorrimento con sostanza',
        selectLanguage: 'Lingua:',
        endOfFeed: 'Hai raggiunto la fine. È tempo di riflettere.',
        bookmarks: 'Segnalibri',
        like: 'Mi piace',
        bookmark: 'Salva',
        markAsRead: 'Segna come letto',
        noBookmarks: 'Nessun segnalibro ancora. Inizia a salvare articoli.',
        readMore: 'Leggi di più',
        categories: {
            philosophy: 'Filosofia',
            science: 'Scienza',
            technology: 'Tecnologia',
            culture: 'Cultura',
            essay: 'Saggio',
            literature: 'Letteratura',
            art: 'Arte',
            history: 'Storia'
        }
    },
    ja: {
        tagline: '意味のあるスクロール',
        selectLanguage: '言語:',
        endOfFeed: '最後まで到達しました。考える時間です。',
        bookmarks: 'ブックマーク',
        like: 'いいね',
        bookmark: '保存',
        markAsRead: '既読にする',
        noBookmarks: 'まだブックマークがありません。後で読みたい記事を保存しましょう。',
        readMore: '続きを読む',
        categories: {
            philosophy: '哲学',
            science: '科学',
            technology: 'テクノロジー',
            culture: '文化',
            essay: 'エッセイ',
            literature: '文学',
            art: 'アート',
            history: '歴史'
        }
    },
    ko: {
        tagline: '의미 있는 스크롤',
        selectLanguage: '언어:',
        endOfFeed: '끝에 도달했습니다. 생각할 시간입니다.',
        bookmarks: '북마크',
        like: '좋아요',
        bookmark: '저장',
        markAsRead: '읽음으로 표시',
        noBookmarks: '아직 북마크가 없습니다. 나중에 읽을 기사를 저장하세요.',
        readMore: '더 읽기',
        categories: {
            philosophy: '철학',
            science: '과학',
            technology: '기술',
            culture: '문화',
            essay: '에세이',
            literature: '문학',
            art: '예술',
            history: '역사'
        }
    },
    zh: {
        tagline: '有内容的滚动',
        selectLanguage: '语言:',
        endOfFeed: '你已到达终点。是时候思考了。',
        bookmarks: '书签',
        like: '点赞',
        bookmark: '保存',
        markAsRead: '标记为已读',
        noBookmarks: '还没有书签。开始保存你想稍后阅读的文章。',
        readMore: '阅读更多',
        categories: {
            philosophy: '哲学',
            science: '科学',
            technology: '技术',
            culture: '文化',
            essay: '随笔',
            literature: '文学',
            art: '艺术',
            history: '历史'
        }
    }
};

let currentLanguage = 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(i18n[lang], key);
        if (translation) {
            element.textContent = translation;
        }
    });
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function t(key) {
    return getNestedTranslation(i18n[currentLanguage], key) || key;
}
