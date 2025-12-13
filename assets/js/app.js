// Global variables
let products = [];
let currentFilter = 'all';
let currentSort = 'name';
let searchQuery = '';
let aboutData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadAboutContent();
    loadContactContent();
    setupEventListeners();
    setupMenuToggle();
    setupLogoClick();
    setupFAQ();
    setupReviewModal();
    loadRandomGallery();
    setupScrollToTop();
    if (typeof window.updatePageLanguage === 'function') {
        window.updatePageLanguage();
    }
});

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('./_data/products.json');
        products = await response.json();
        setupHeroCarousel();
        renderProducts('all');
        if (typeof window.updatePageLanguage === 'function') {
            window.updatePageLanguage();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Use sample data if fetch fails
        renderProducts('all');
    }
}

// Load about content from JSON
async function loadAboutContent() {
    try {
        const response = await fetch('./_data/about.json');
        aboutData = await response.json();
        updateAboutContent();
        if (typeof window.updatePageLanguage === 'function') {
            window.updatePageLanguage();
        }
    } catch (error) {
        console.error('Error loading about content:', error);
        aboutData = {};
        updateAboutContent();
    }
}

// Load contact content
async function loadContactContent() {
    try {
        const response = await fetch('./_data/contact.json');
        const contactData = await response.json();
        updateContactContent(contactData);
        if (typeof window.updatePageLanguage === 'function') {
            window.updatePageLanguage();
        }
    } catch (error) {
        console.error('Error loading contact content:', error);
        updateContactContent();
    }
}

// Render products based on filter and sort
function renderProducts(filter) {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    let filtered = products;
    
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    
    // Add click listeners
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = products.find(p => p.id === productId);
            openProductModal(product);
        });
    });
}

// Create product card HTML
function createProductCard(product) {
    const randomSeed = Math.floor(Math.random() * 10000) + Math.floor(Math.random() * 1000);
    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="https://picsum.photos/280/250?random=${randomSeed}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}€</p>
            </div>
        </div>
    `;
}

// Render carousel
function renderCarousel() {
    // This function is now empty - carousel-section has been removed
    return;
}

// Setup carousel navigation
function setupCarouselNavigation() {
    // This function is now empty - carousel-section has been removed
    return;
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const baseRandom = Date.now();
    
    // Block body scroll
    document.body.style.overflow = 'hidden';
    
    // Create gallery images
    const galleryImages = [];
    for (let i = 0; i < 6; i++) {
        galleryImages.push(`https://picsum.photos/500/500?random=${baseRandom + i * 1000 + Math.random() * 10000}`);
    }
    
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `${product.price}€`;
    document.getElementById('modal-main-image').src = galleryImages[0];
    document.getElementById('modal-main-image').dataset.currentIndex = 0;
    
    // Create thumbnails
    const thumbContainer = document.getElementById('gallery-thumbs');
    thumbContainer.innerHTML = galleryImages.map((img, index) => `
        <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${img}" alt="Gallery image ${index + 1}">
        </div>
    `).join('');
    
    // Setup thumbnail clicks
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = this.dataset.index;
            updateMainImage(index, galleryImages);
        });
    });
    
    // Setup arrow navigation
    const prevArrow = document.querySelector('.gallery-nav-prev');
    const nextArrow = document.querySelector('.gallery-nav-next');
    
    if (prevArrow) {
        prevArrow.onclick = (e) => {
            e.stopPropagation();
            let currentIndex = parseInt(document.getElementById('modal-main-image').dataset.currentIndex);
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateMainImage(currentIndex, galleryImages);
        };
    }
    
    if (nextArrow) {
        nextArrow.onclick = (e) => {
            e.stopPropagation();
            let currentIndex = parseInt(document.getElementById('modal-main-image').dataset.currentIndex);
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateMainImage(currentIndex, galleryImages);
        };
    }
    
    modal.classList.add('active');
}

// Update main image in modal
function updateMainImage(index, galleryImages) {
    const mainImage = document.getElementById('modal-main-image');
    mainImage.src = galleryImages[index];
    mainImage.dataset.currentIndex = index;
    
    // Update thumbnail active state
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Close modal
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.target.closest('.modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Setup menu toggle
function setupMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Setup logo click
function setupLogoClick() {
    document.querySelectorAll('.logo-link').forEach(logo => {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Setup FAQ
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other answers
            document.querySelectorAll('.faq-question').forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current answer
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
}

// Setup review modal
function setupReviewModal() {
    const openButton = document.getElementById('open-review-modal');
    const modal = document.getElementById('review-modal');
    const form = document.getElementById('review-form');
    
    if (openButton && modal) {
        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your review!');
            modal.classList.remove('active');
            form.reset();
        });
    }
}

// Load random gallery
function loadRandomGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryCarouselTrack = document.getElementById('gallery-carousel-track');
    if (!galleryGrid) return;
    
    const baseRandom = Math.floor(Math.random() * 10000);
    let galleryImages = [];
    
    for (let i = 0; i < 9; i++) {
        const randomSeed = baseRandom + i * 1000 + Math.random() * 500;
        galleryImages.push(Math.floor(randomSeed));
        
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = i;
        item.innerHTML = `
            <img src="https://picsum.photos/350/350?random=${galleryImages[i]}" 
                 alt="Random inspiration ${i + 1}" 
                 loading="lazy">
        `;
        galleryGrid.appendChild(item);
        
        // Add click handler to open modal
        item.addEventListener('click', function() {
            openGalleryModal(i, galleryImages);
        });
    }
    
    // Create carousel items for modal (will be used when modal opens)
    window.galleryImages = galleryImages;
}

function openGalleryModal(startIndex, images) {
    const modal = document.getElementById('gallery-modal');
    const track = document.getElementById('gallery-carousel-track');
    
    // Clear track
    track.innerHTML = '';
    
    // Create carousel items
    images.forEach((seed, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-carousel-item';
        item.innerHTML = `<img src="https://picsum.photos/600/600?random=${seed}" alt="Gallery image ${i + 1}">`;
        track.appendChild(item);
    });
    
    // Clone first and last items for seamless loop
    const firstClone = images[0];
    const lastClone = images[images.length - 1];
    
    const firstItem = document.createElement('div');
    firstItem.className = 'gallery-carousel-item';
    firstItem.innerHTML = `<img src="https://picsum.photos/600/600?random=${lastClone}" alt="Gallery image ${images.length}">`;
    track.insertBefore(firstItem, track.firstChild);
    
    const lastItem = document.createElement('div');
    lastItem.className = 'gallery-carousel-item';
    lastItem.innerHTML = `<img src="https://picsum.photos/600/600?random=${firstClone}" alt="Gallery image 1">`;
    track.appendChild(lastItem);
    
    // Show modal
    modal.classList.add('active');
    
    // Set initial position (offset for cloned first item)
    track.style.transform = `translateX(${-(startIndex + 1) * 100}%)`;
    
    // Setup carousel navigation
    setupGalleryCarousel(images.length, startIndex + 1);
}

function setupGalleryCarousel(itemCount, startIndex) {
    const modal = document.getElementById('gallery-modal');
    const track = document.getElementById('gallery-carousel-track');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const closeBtn = document.getElementById('gallery-modal-close');
    
    let currentIndex = startIndex;
    let autoPlayInterval;
    let isTransitioning = false;
    
    function goToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        track.style.transition = 'transform 1.2s ease-in-out';
        track.style.transform = `translateX(${-index * 100}%)`;
        currentIndex = index;
        
        setTimeout(() => {
            // Handle seamless loop
            if (index === itemCount + 1) {
                // Jumped to last clone, go back to first real item
                track.style.transition = 'none';
                track.style.transform = `translateX(${-1 * 100}%)`;
                currentIndex = 1;
            } else if (index === 0) {
                // Jumped to first clone, go back to last real item
                track.style.transition = 'none';
                track.style.transform = `translateX(${-itemCount * 100}%)`;
                currentIndex = itemCount;
            }
            isTransitioning = false;
        }, 1200);
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 8000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        clearInterval(autoPlayInterval);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            clearInterval(autoPlayInterval);
        }
    });
    
    // Start auto-play
    startAutoPlay();
}

// Setup scroll to top button
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Update contact content
function updateContactContent(data = {}) {
    const contactContent = document.getElementById('contact-content');
    if (!contactContent) return;
    
    const email = data.email || 'contact@eclatsderesine.fr';
    const phone = data.phone || '+33 (0)1 23 45 67 89';
    const address = data.address || '123 Rue de la Résine, 75000 Paris, France';
    
    const labelName = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.name') : 'Nom';
    const labelEmail = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.email') : 'Email';
    const labelMessage = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.message') : 'Message';
    const btnSend = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.send') : 'Envoyer';
    const labelPhone = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.phone') : 'Téléphone';
    const labelAddress = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.address') : 'Adresse';
    
    const content = `
        <div class="contact-form">
            <div class="form-group">
                <label for="contact-name">${labelName}</label>
                <input type="text" id="contact-name" required>
            </div>
            <div class="form-group">
                <label for="contact-email">${labelEmail}</label>
                <input type="email" id="contact-email" required>
            </div>
            <div class="form-group">
                <label for="contact-message">${labelMessage}</label>
                <textarea id="contact-message" required></textarea>
            </div>
            <button class="submit-btn" onclick="sendContactForm()">${btnSend}</button>
        </div>
        <div class="contact-info">
            <div class="contact-info-item">
                <h3 class="contact-info-title">${labelEmail}</h3>
                <p class="contact-info-value"><a href="mailto:${email}">${email}</a></p>
            </div>
            <div class="contact-info-item">
                <h3 class="contact-info-title">${labelPhone}</h3>
                <p class="contact-info-value"><a href="tel:${phone}">${phone}</a></p>
            </div>
            <div class="contact-info-item">
                <h3 class="contact-info-title">${labelAddress}</h3>
                <p class="contact-info-value">${address}</p>
            </div>
            <div class="contact-info-item">
                <h3 class="contact-info-title">Réseaux Sociaux</h3>
                <div class="contact-social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="contact-social-link" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                        </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="contact-social-link" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-1.823-.177-3.456-.177-3.559 0-6.005 2.131-6.005 6.001V8z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    contactContent.innerHTML = content;
}

// Send contact form
function sendContactForm() {
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const message = document.getElementById('contact-message')?.value;
    
    if (name && email && message) {
        const successMsg = typeof window.i18next !== 'undefined' ? window.i18next.t('contact.success') : 'Merci pour votre message! Nous vous répondrons bientôt.';
        alert(successMsg);
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-message').value = '';
    }
}

// Update about content
function updateAboutContent() {
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent) return;
    
    const text1 = typeof window.i18next !== 'undefined' ? window.i18next.t('about.text1') : 'Chaque création d\'Éclats de Résine est le fruit d\'une passion pour les matériaux et les techniques artisanales. Nous utilisons de la résine époxy de qualité supérieure, combinée à des pigments et des éléments naturels pour créer des pièces uniques et intemporelles.';
    const text2 = typeof window.i18next !== 'undefined' ? window.i18next.t('about.text2') : 'Fondée en 2020, notre atelier est dédié à la création de bijoux, de décoration intérieure et d\'accessoires en résine. Chaque client reçoit une attention personnalisée pour transformer ses idées en réalité.';
    
    const content = `
        <div class="about-text">
            <p>${text1}</p>
            <p>${text2}</p>
        </div>
        <img src="https://picsum.photos/500/600?random=1001" alt="À propos" class="about-img">
    `;
    
    aboutContent.innerHTML = content;
}

// Setup hero carousel
function setupHeroCarousel() {
    const track = document.getElementById('hero-carousel-track');
    if (!track || products.length === 0) return;
    
    const itemsToShow = Math.min(5, products.length);
    
    track.innerHTML = products.slice(0, itemsToShow).map((product, index) => {
        const randomSeed = Math.floor(Math.random() * 10000) + index + 5000;
        return `
            <div class="hero-carousel-item" data-product-id="${product.id}">
                <img src="https://picsum.photos/1920/600?random=${randomSeed}" alt="${product.name}">
            </div>
        `;
    }).join('');
    
    // Add click listeners
    document.querySelectorAll('.hero-carousel-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = products.find(p => p.id === productId);
            openProductModal(product);
        });
    });
    
    setupHeroCarouselNavigation();
}

// Setup hero carousel navigation
function setupHeroCarouselNavigation() {
    const prevBtn = document.querySelector('.hero-carousel-btn-prev');
    const nextBtn = document.querySelector('.hero-carousel-btn-next');
    const track = document.getElementById('hero-carousel-track');
    const carousel = document.querySelector('.hero');
    
    if (!prevBtn || !nextBtn || !track || !carousel) {
        console.log('Carousel elements not found');
        return;
    }
    
    const items = Array.from(track.querySelectorAll('.hero-carousel-item'));
    const itemCount = items.length;
    if (itemCount === 0) return;

    // Clone edges for seamless loop
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[itemCount - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);

    let currentIndex = 1; // start at the first real slide after the prepended clone
    const itemWidth = 100; // percent
    const gap = 0;
    let autoPlayInterval = null;

    function setPosition(index, withTransition = true) {
        track.style.transition = withTransition ? 'transform 1.2s ease-in-out' : 'none';
        const offset = -index * (itemWidth + gap);
        track.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentIndex += 1;
        setPosition(currentIndex, true);
    }

    function prevSlide() {
        currentIndex -= 1;
        setPosition(currentIndex, true);
    }

    track.addEventListener('transitionend', () => {
        // If we've hit the clone at the end, jump to first real slide
        if (currentIndex === itemCount + 1) {
            currentIndex = 1;
            setPosition(currentIndex, false);
        }
        // If we've hit the clone at the start, jump to last real slide
        if (currentIndex === 0) {
            currentIndex = itemCount;
            setPosition(currentIndex, false);
        }
    });
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 8000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Button click handlers
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        resetAutoPlay();
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize position at first real slide
    setPosition(currentIndex, false);

    // Start autoplay
    startAutoPlay();
}
