// Animations JavaScript file for Edama E-commerce

document.addEventListener('DOMContentLoaded', function() {
    // Entry animation for welcome page
    const welcomeAnimation = document.querySelector('.welcome-animation');
    if (welcomeAnimation) {
        setTimeout(() => {
            welcomeAnimation.style.opacity = '1';
            welcomeAnimation.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Staggered animation for product cards
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length) {
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }
    
    // Animate discount badges
    const discountBadges = document.querySelectorAll('.discount-badge');
    if (discountBadges.length) {
        discountBadges.forEach(badge => {
            badge.classList.add('flash');
        });
    }
    
    // Animate carousel slides
    initCarousel();
});

// Carousel animation
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentSlide = 0;
    
    // Show initial slide
    showSlide(currentSlide);
    
    // Auto slide change
    let slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        });
    }
    
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(() => {
                    nextSlide();
                }, 5000);
            });
        });
    }
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
}
