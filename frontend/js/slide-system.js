// Simple and Reliable Slide System
class SlideSystem {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.navDots = Array.from(document.querySelectorAll('.nav-dot'));
        
        console.log(`Initialized slide system with ${this.slides.length} slides`);
        
        // Initialize all slides
        this.slides.forEach((slide, index) => {
            slide.style.position = 'fixed';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100vw';
            slide.style.height = '100vh';
            slide.style.zIndex = index === 0 ? '10' : '1';
            slide.style.opacity = index === 0 ? '1' : '0';
            slide.style.visibility = index === 0 ? 'visible' : 'hidden';
            slide.style.transition = 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out';
        });

        // Show first slide
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            this.navDots[0]?.classList.add('active');
        }

        this.setupNavigation();
    }

    setupNavigation() {
        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            // Don't trigger slide change if scrolling on the globe
            const earthContainer = document.getElementById('earth-container');
            if (earthContainer && earthContainer.contains(e.target)) {
                return; // Allow normal scrolling on the globe
            }
            
            e.preventDefault();
            const delta = e.deltaY;
            
            if (delta > 50) {
                this.nextSlide();
            } else if (delta < -50) {
                this.prevSlide();
            }
        }, { passive: false });

        // Touch navigation
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });

        // Navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length || this.isTransitioning) return;
        
        console.log(`Switching from slide ${this.currentSlide + 1} to slide ${slideIndex + 1}`);
        
        this.isTransitioning = true;
        
        // Hide current slide
        const currentSlideElement = this.slides[this.currentSlide];
        const newSlideElement = this.slides[slideIndex];
        
        if (currentSlideElement) {
            currentSlideElement.style.opacity = '0';
            currentSlideElement.style.visibility = 'hidden';
            currentSlideElement.style.zIndex = '1';
            currentSlideElement.classList.remove('active');
        }
        
        // Show new slide
        if (newSlideElement) {
            newSlideElement.style.opacity = '1';
            newSlideElement.style.visibility = 'visible';
            newSlideElement.style.zIndex = '10';
            newSlideElement.classList.add('active');
        }
        
        // Update navigation
        this.navDots[this.currentSlide]?.classList.remove('active');
        this.navDots[slideIndex]?.classList.add('active');
        
        this.currentSlide = slideIndex;
        
        // Update slide counter
        this.updateSlideCounter();
        
        // Initialize slide-specific content
        this.initSlideContent(slideIndex);
        
        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateSlideCounter() {
        const counter = document.querySelector('.slide-counter');
        if (counter) {
            counter.textContent = `${this.currentSlide + 1}/${this.slides.length}`;
        }
    }

    initSlideContent(slideIndex) {
        // Initialize particles for the new slide
        if (window.onSlideChangeParticles) {
            window.onSlideChangeParticles(slideIndex);
        }
        
        // Initialize Earth for slide 2 (index 1)
        if (slideIndex === 1 && window.onSlideChangeEarth) {
            window.onSlideChangeEarth(slideIndex);
        }
        
        // Initialize stats for slide 3 (index 2)
        if (slideIndex === 2 && window.initStatsAnimation) {
            window.initStatsAnimation();
        }
    }
}

// Initialize slide system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.slideSystem = new SlideSystem();
});
