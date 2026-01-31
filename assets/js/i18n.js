// ⚠️  ВНИМАНИЕ: Этот файл в настоящее время НЕ ИСПОЛЬЗУЕТСЯ
// Локализация отключена. Используется только французский язык.
// Чтобы активировать i18n, раскомментируйте <script src="assets/js/i18n.js"></script> в index.html
// и добавьте атрибуты data-i18n обратно в HTML элементы

// Simple i18n implementation
window.i18next = {
    language: localStorage.getItem('language') || 'fr',
    
    resources: {
        fr: {
            translation: {
                'header.home': 'Accueil',
                'header.collections': 'Collections',
                'header.about': 'À propos',
                'header.contact': 'Contact',
                'hero.title': 'Créations en Résine',
                'hero.subtitle': 'Chaque pièce est unique et faite avec passion',
                'hero.cta': 'Découvrir nos collections',
                'collections.title': 'Nos Collections',
                'collections.subtitle': 'Explorez nos créations artisanales uniques',
                'collections.search': 'Rechercher...',
                'collections.all': 'Tous',
                'collections.jewelry': 'Bijoux',
                'collections.home': 'Décoration',
                'collections.accessories': 'Accessoires',
                'collections.sortName': 'Nom (A-Z)',
                'collections.sortPriceAsc': 'Prix (↑)',
                'collections.sortPriceDesc': 'Prix (↓)',
                'collections.featured': 'Produits en vedette',
                'gallery.title': 'Inspirations',
                'about.title': 'À propos',
                'testimonials.title': 'Avis clients',
                'testimonials.review1': '"Absolutely beautiful work! The attention to detail is amazing."',
                'testimonials.author1': '- Marie',
                'testimonials.review2': '"Each piece is truly unique and of excellent quality."',
                'testimonials.author2': '- Jean',
                'testimonials.review3': '"I love my custom order! Highly recommend!"',
                'testimonials.author3': '- Sophie',
                'testimonials.writeReview': 'Laisser un avis',
                'testimonials.modalTitle': 'Laisser un avis',
                'testimonials.name': 'Votre nom',
                'testimonials.rating': 'Note:',
                'testimonials.review': 'Votre avis...',
                'faq.title': 'Questions fréquentes',
                'faq.q1': 'Combien de temps prend une commande personnalisée?',
                'faq.a1': 'Les commandes personnalisées prennent généralement entre 2 à 4 semaines, selon la complexité.',
                'faq.q2': 'Acceptez-vous les retours?',
                'faq.a2': 'Nous acceptons les retours dans les 30 jours si le produit n\'a pas été utilisé.',
                'faq.q3': 'Livrez-vous à l\'international?',
                'faq.a3': 'Oui, nous livrons dans la plupart des pays européens et au-delà.',
                'contact.title': 'Contact',
                'form.submit': 'Envoyer',
                'footer.copyright': '© 2026 Éclats de Résine. Tous droits réservés.',
                'footer.tagline': 'Créations uniques en résine époxy',
                'products.addToCart': 'Ajouter au panier',
                'about.text1': 'Chaque création d\'Éclats de Résine est le fruit d\'une passion pour les matériaux et les techniques artisanales. Nous utilisons de la résine époxy de qualité supérieure, combinée à des pigments et des éléments naturels pour créer des pièces uniques et intemporelles.',
                'about.text2': 'Fondée en 2020, notre atelier est dédié à la création de bijoux, de décoration intérieure et d\'accessoires en résine. Chaque client reçoit une attention personnalisée pour transformer ses idées en réalité.',
                'contact.email': 'Email',
                'contact.phone': 'Téléphone',
                'contact.address': 'Adresse',
                'contact.name': 'Nom',
                'contact.message': 'Message',
                'contact.send': 'Envoyer',
                'contact.success': 'Merci pour votre message! Nous vous répondrons bientôt.'
            }
        },
        en: {
            translation: {
                'header.home': 'Home',
                'header.collections': 'Collections',
                'header.about': 'About',
                'header.contact': 'Contact',
                'hero.title': 'Resin Creations',
                'hero.subtitle': 'Each piece is unique and made with passion',
                'hero.cta': 'Discover our collections',
                'collections.title': 'Our Collections',
                'collections.subtitle': 'Explore our unique handcrafted creations',
                'collections.search': 'Search...',
                'collections.all': 'All',
                'collections.jewelry': 'Jewelry',
                'collections.home': 'Home Decor',
                'collections.accessories': 'Accessories',
                'collections.sortName': 'Name (A-Z)',
                'collections.sortPriceAsc': 'Price (↑)',
                'collections.sortPriceDesc': 'Price (↓)',
                'collections.featured': 'Featured Products',
                'gallery.title': 'Inspirations',
                'about.title': 'About',
                'testimonials.title': 'Customer Reviews',
                'testimonials.review1': '"Absolutely beautiful work! The attention to detail is amazing."',
                'testimonials.author1': '- Marie',
                'testimonials.review2': '"Each piece is truly unique and of excellent quality."',
                'testimonials.author2': '- Jean',
                'testimonials.review3': '"I love my custom order! Highly recommend!"',
                'testimonials.author3': '- Sophie',
                'testimonials.writeReview': 'Leave a review',
                'testimonials.modalTitle': 'Leave a review',
                'testimonials.name': 'Your name',
                'testimonials.rating': 'Rating:',
                'testimonials.review': 'Your review...',
                'faq.title': 'Frequently Asked Questions',
                'faq.q1': 'How long does a custom order take?',
                'faq.a1': 'Custom orders typically take between 2 to 4 weeks depending on complexity.',
                'faq.q2': 'Do you accept returns?',
                'faq.a2': 'We accept returns within 30 days if the product has not been used.',
                'faq.q3': 'Do you ship internationally?',
                'faq.a3': 'Yes, we ship to most countries in Europe and beyond.',
                'contact.title': 'Contact',
                'form.submit': 'Send',
                'footer.copyright': '© 2026 Éclats de Résine. All rights reserved.',
                'footer.tagline': 'Unique creations in epoxy resin',
                'products.addToCart': 'Add to cart',
                'about.text1': 'Each creation by Éclats de Résine is the result of a passion for materials and artisanal techniques. We use high-quality epoxy resin, combined with pigments and natural elements to create unique and timeless pieces.',
                'about.text2': 'Founded in 2020, our workshop is dedicated to creating jewelry, home décor, and resin accessories. Each customer receives personalized attention to turn their ideas into reality.',
                'contact.email': 'Email',
                'contact.phone': 'Phone',
                'contact.address': 'Address',
                'contact.name': 'Name',
                'contact.message': 'Message',
                'contact.send': 'Send',
                'contact.success': 'Thank you for your message! We will get back to you soon.'
            }
        },
        es: {
            translation: {
                'header.home': 'Inicio',
                'header.collections': 'Colecciones',
                'header.about': 'Acerca de',
                'header.contact': 'Contacto',
                'hero.title': 'Creaciones en Resina',
                'hero.subtitle': 'Cada pieza es única y hecha con pasión',
                'hero.cta': 'Descubre nuestras colecciones',
                'collections.title': 'Nuestras Colecciones',
                'collections.subtitle': 'Explora nuestras creaciones artesanales únicas',
                'collections.search': 'Buscar...',
                'collections.all': 'Todos',
                'collections.jewelry': 'Joyas',
                'collections.home': 'Decoración',
                'collections.accessories': 'Accesorios',
                'collections.sortName': 'Nombre (A-Z)',
                'collections.sortPriceAsc': 'Precio (↑)',
                'collections.sortPriceDesc': 'Precio (↓)',
                'collections.featured': 'Productos destacados',
                'gallery.title': 'Inspiraciones',
                'about.title': 'Acerca de',
                'testimonials.title': 'Opiniones de clientes',
                'testimonials.review1': '"¡Trabajo absolutamente hermoso! La atención al detalle es increíble."',
                'testimonials.author1': '- Marie',
                'testimonials.review2': '"Cada pieza es realmente única y de excelente calidad."',
                'testimonials.author2': '- Jean',
                'testimonials.review3': '"¡Amo mi pedido personalizado! ¡Muy recomendado!"',
                'testimonials.author3': '- Sophie',
                'testimonials.writeReview': 'Dejar una opinión',
                'testimonials.modalTitle': 'Dejar una opinión',
                'testimonials.name': 'Tu nombre',
                'testimonials.rating': 'Calificación:',
                'testimonials.review': 'Tu opinión...',
                'faq.title': 'Preguntas frecuentes',
                'faq.q1': '¿Cuánto tarda un pedido personalizado?',
                'faq.a1': 'Los pedidos personalizados suelen tardar entre 2 y 4 semanas según la complejidad.',
                'faq.q2': '¿Aceptan devoluciones?',
                'faq.a2': 'Aceptamos devoluciones dentro de los 30 días si el producto no ha sido usado.',
                'faq.q3': '¿Envían internacionalmente?',
                'faq.a3': 'Sí, enviamos a la mayoría de los países europeos y más allá.',
                'contact.title': 'Contacto',
                'form.submit': 'Enviar',
                'footer.copyright': '© 2026 Éclats de Résine. Todos los derechos reservados.',
                'footer.tagline': 'Creaciones únicas en resina epoxi',
                'products.addToCart': 'Agregar al carrito',
                'about.text1': 'Cada creación de Éclats de Résine es el resultado de una pasión por los materiales y las técnicas artesanales. Utilizamos resina epoxi de alta calidad, combinada con pigmentos y elementos naturales para crear piezas únicas y atemporales.',
                'about.text2': 'Fundada en 2020, nuestro taller se dedica a la creación de joyas, decoración del hogar y accesorios de resina. Cada cliente recibe atención personalizada para convertir sus ideas en realidad.',
                'contact.email': 'Email',
                'contact.phone': 'Teléfono',
                'contact.address': 'Dirección',
                'contact.name': 'Nombre',
                'contact.message': 'Mensaje',
                'contact.send': 'Enviar',
                'contact.success': '¡Gracias por tu mensaje! Te responderemos pronto.'
            }
        },
        de: {
            translation: {
                'header.home': 'Start',
                'header.collections': 'Kollektionen',
                'header.about': 'Über uns',
                'header.contact': 'Kontakt',
                'hero.title': 'Harzkreationen',
                'hero.subtitle': 'Jedes Stück ist einzigartig und mit Leidenschaft gefertigt',
                'hero.cta': 'Entdecke unsere Kollektionen',
                'collections.title': 'Unsere Kollektionen',
                'collections.subtitle': 'Entdecke unsere einzigartigen handgefertigten Kreationen',
                'collections.search': 'Suchen...',
                'collections.all': 'Alle',
                'collections.jewelry': 'Schmuck',
                'collections.home': 'Deko',
                'collections.accessories': 'Accessoires',
                'collections.sortName': 'Name (A-Z)',
                'collections.sortPriceAsc': 'Preis (↑)',
                'collections.sortPriceDesc': 'Preis (↓)',
                'collections.featured': 'Ausgewählte Produkte',
                'gallery.title': 'Inspirationen',
                'about.title': 'Über uns',
                'testimonials.title': 'Kundenbewertungen',
                'testimonials.review1': '"Absolut schöne Arbeit! Die Liebe zum Detail ist erstaunlich."',
                'testimonials.author1': '- Marie',
                'testimonials.review2': '"Jedes Stück ist wirklich einzigartig und von hervorragender Qualität."',
                'testimonials.author2': '- Jean',
                'testimonials.review3': '"Ich liebe meine Bestellung! Sehr zu empfehlen!"',
                'testimonials.author3': '- Sophie',
                'testimonials.writeReview': 'Bewertung abgeben',
                'testimonials.modalTitle': 'Bewertung abgeben',
                'testimonials.name': 'Ihr Name',
                'testimonials.rating': 'Bewertung:',
                'testimonials.review': 'Ihre Bewertung...',
                'faq.title': 'Häufige Fragen',
                'faq.q1': 'Wie lange dauert eine Sonderbestellung?',
                'faq.a1': 'Sonderbestellungen dauern in der Regel 2 bis 4 Wochen, je nach Komplexität.',
                'faq.q2': 'Akzeptieren Sie Rücksendungen?',
                'faq.a2': 'Wir akzeptieren Rücksendungen innerhalb von 30 Tagen, wenn das Produkt unbenutzt ist.',
                'faq.q3': 'Liefern Sie international?',
                'faq.a3': 'Ja, wir liefern in die meisten europäischen Länder und darüber hinaus.',
                'contact.title': 'Kontakt',
                'form.submit': 'Senden',
                'footer.copyright': '© 2026 Éclats de Résine. Alle Rechte vorbehalten.',
                'footer.tagline': 'Einzigartige Kreationen aus Epoxidharz',
                'products.addToCart': 'In den Warenkorb',
                'about.text1': 'Jede Kreation von Éclats de Résine ist das Ergebnis einer Leidenschaft für Materialien und handwerkliche Techniken. Wir verwenden hochwertige Epoxidharz, kombiniert mit Pigmenten und natürlichen Elementen, um einzigartige und zeitlose Stücke zu schaffen.',
                'about.text2': 'Unser Atelier wurde 2020 gegründet und widmet sich der Herstellung von Schmuck, Heimdekoration und Harzaccessoires. Jeder Kunde erhält persönliche Aufmerksamkeit, um seine Ideen in die Realität umzusetzen.',
                'contact.email': 'Email',
                'contact.phone': 'Telefon',
                'contact.address': 'Adresse',
                'contact.name': 'Name',
                'contact.message': 'Nachricht',
                'contact.send': 'Senden',
                'contact.success': 'Danke für deine Nachricht! Wir werden dich bald kontaktieren.'
            }
        },
        it: {
            translation: {
                'header.home': 'Inizio',
                'header.collections': 'Collezioni',
                'header.about': 'Chi siamo',
                'header.contact': 'Contatto',
                'hero.title': 'Creazioni in Resina',
                'hero.subtitle': 'Ogni pezzo è unico e fatto con passione',
                'hero.cta': 'Scopri le nostre collezioni',
                'collections.title': 'Le nostre Collezioni',
                'collections.subtitle': 'Esplora le nostre creazioni artigianali uniche',
                'collections.search': 'Cerca...',
                'collections.all': 'Tutti',
                'collections.jewelry': 'Gioielli',
                'collections.home': 'Decorazione',
                'collections.accessories': 'Accessori',
                'collections.sortName': 'Nome (A-Z)',
                'collections.sortPriceAsc': 'Prezzo (↑)',
                'collections.sortPriceDesc': 'Prezzo (↓)',
                'collections.featured': 'Prodotti in evidenza',
                'gallery.title': 'Ispirazioni',
                'about.title': 'Chi siamo',
                'testimonials.title': 'Recensioni dei clienti',
                'testimonials.review1': '"Lavoro assolutamente bellissimo! L’attenzione ai dettagli è fantastica."',
                'testimonials.author1': '- Marie',
                'testimonials.review2': '"Ogni pezzo è davvero unico e di ottima qualità."',
                'testimonials.author2': '- Jean',
                'testimonials.review3': '"Adoro il mio ordine personalizzato! Consigliatissimo!"',
                'testimonials.author3': '- Sophie',
                'testimonials.writeReview': 'Lascia una recensione',
                'testimonials.modalTitle': 'Lascia una recensione',
                'testimonials.name': 'Il tuo nome',
                'testimonials.rating': 'Voto:',
                'testimonials.review': 'La tua recensione...',
                'faq.title': 'Domande frequenti',
                'faq.q1': 'Quanto tempo richiede un ordine personalizzato?',
                'faq.a1': 'Gli ordini personalizzati richiedono in genere tra 2 e 4 settimane, a seconda della complessità.',
                'faq.q2': 'Accettate resi?',
                'faq.a2': 'Accettiamo resi entro 30 giorni se il prodotto non è stato utilizzato.',
                'faq.q3': 'Spedite a livello internazionale?',
                'faq.a3': 'Sì, spediamo nella maggior parte dei paesi europei e oltre.',
                'contact.title': 'Contatto',
                'form.submit': 'Invia',
                'footer.copyright': '© 2026 Éclats de Résine. Tutti i diritti riservati.',
                'footer.tagline': 'Creazioni uniche in resina epossidica',
                'products.addToCart': 'Aggiungi al carrello',
                'about.text1': 'Ogni creazione di Éclats de Résine è il risultato di una passione per i materiali e le tecniche artigianali. Utilizziamo resina epossidica di alta qualità, combinata con pigmenti ed elementi naturali per creare pezzi unici e senza tempo.',
                'about.text2': 'Fondata nel 2020, il nostro laboratorio è dedicato alla creazione di gioielli, arredamento per la casa e accessori in resina. Ogni cliente riceve attenzione personalizzata per trasformare le proprie idee in realtà.',
                'contact.email': 'Email',
                'contact.phone': 'Telefono',
                'contact.address': 'Indirizzo',
                'contact.name': 'Nome',
                'contact.message': 'Messaggio',
                'contact.send': 'Invia',
                'contact.success': 'Grazie per il tuo messaggio! Ti risponderemo presto.'
            }
        }
    },
    
    t: function(key) {
        const lang = this.resources[this.language] ? this.language : 'fr';
        const translations = this.resources[lang]?.translation || {};
        // Support both flat keys with dots and nested objects
        if (Object.prototype.hasOwnProperty.call(translations, key)) {
            return translations[key];
        }
        const value = key.split('.').reduce((acc, part) => acc && acc[part], translations);
        return value || key;
    },
    
    changeLanguage: function(lang) {
        this.language = this.resources[lang] ? lang : 'fr';
        document.documentElement.lang = this.language;
    }
};

// Initialize on page load
function initI18nUI() {
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = i18next.resources[i18next.language] ? i18next.language : 'fr';
        langSelect.addEventListener('change', function() {
            i18next.changeLanguage(this.value);
            localStorage.setItem('language', this.value);
            updatePageLanguage();
        });
    }
    updatePageLanguage();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18nUI);
} else {
    initI18nUI();
}

function updatePageLanguage() {
    console.log('🔤 Updating page language:', window.i18next.language);
    document.documentElement.lang = window.i18next.language;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = window.i18next.t(key);
        console.log(`Translating ${key} → ${translation}`);
        el.textContent = translation;
    });
    
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const attr = el.getAttribute('data-i18n-attr');
        const key = el.getAttribute('data-i18n');
        if (attr && key) {
            const translation = window.i18next.t(key);
            el.setAttribute(attr, translation);
        }
    });
    
    // Refresh dynamic content sections
    if (typeof updateAboutContent === 'function') {
        updateAboutContent();
    }
    if (typeof updateContactContent === 'function') {
        updateContactContent();
    }
}
