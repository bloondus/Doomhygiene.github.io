// Configuration
const CONFIG = {
    articlesPerLoad: 5, // Reduziert von 10 auf 5 - weniger DOM-Operationen
    scrollThreshold: 800, // Größer = früher nachladen
    maxArticlesInDOM: 30, // Max Artikel gleichzeitig im DOM (Rest virtualisieren)
    imageLoadingDelay: 100 // Lazy load images nach 100ms
};
