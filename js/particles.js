/* ===== PARTICLES.JS CONFIGURATION ===== */

// Light slides particles configuration (odd numbers: 1, 3, 5, 7, 9, 11)
const lightParticlesConfig = {
    particles: {
        number: { 
            value: 120,
            density: { enable: true, value_area: 600 }
        },
        color: { 
            value: ['#00bfa6', '#00D4FF', '#2ECC71', '#E0A82E']
        },
        shape: { 
            type: 'circle'
        },
        opacity: { 
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: { 
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 120,
            color: '#00bfa6',
            opacity: 0.4,
            width: 1,
            shadow: {
                enable: true,
                color: '#00bfa6',
                blur: 3
            }
        },
        move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { 
                enable: true, 
                mode: 'repulse'
            },
            onclick: { 
                enable: true, 
                mode: 'push'
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
};

// Dark slides particles configuration (even numbers: 2, 4, 6, 8, 10)
const darkParticlesConfig = {
    particles: {
        number: { 
            value: 150,
            density: { enable: true, value_area: 500 }
        },
        color: { 
            value: ['#00bfa6', '#00D4FF', '#2ECC71', '#E0A82E']
        },
        shape: { 
            type: 'circle'
        },
        opacity: { 
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.3,
                sync: false
            }
        },
        size: { 
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 120,
            color: '#00bfa6',
            opacity: 0.7,
            width: 1.5,
            shadow: {
                enable: true,
                color: '#00bfa6',
                blur: 5
            }
        },
        move: {
            enable: true,
            speed: 0.8,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { 
                enable: true, 
                mode: 'repulse'
            },
            onclick: { 
                enable: true, 
                mode: 'push'
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
};

// Special configuration for slide 2 (Earth section) - reduced particles to avoid globe interference
const earthParticlesConfig = {
    particles: {
        number: { 
            value: 80,
            density: { enable: true, value_area: 800 }
        },
        color: { 
            value: ['#00bfa6', '#00D4FF', '#2ECC71', '#E0A82E']
        },
        shape: { 
            type: 'circle'
        },
        opacity: { 
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: { 
            value: 1.5,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.5,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 100,
            color: '#00bfa6',
            opacity: 0.3,
            width: 0.8,
            shadow: {
                enable: true,
                color: '#00bfa6',
                blur: 2
            }
        },
        move: {
            enable: true,
            speed: 0.4,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { 
                enable: false
            },
            onclick: { 
                enable: false
            },
            resize: true
        }
    },
    retina_detect: true
};

// Track initialized particles instances
const initializedParticles = new Set();

function initParticlesForSlide(slideIndex) {
    console.log(`Initializing particles for slide ${slideIndex + 1}...`);
    
    // Check if particlesJS is available
    if (typeof particlesJS === 'undefined') {
        console.error('particlesJS library not loaded!');
        return;
    }
    
    // Get the slide element
    const slides = document.querySelectorAll('.slide');
    if (slideIndex >= slides.length) {
        console.error(`Slide index ${slideIndex} out of range (${slides.length} slides)`);
        return;
    }
    
    const slide = slides[slideIndex];
    console.log(`Slide ${slideIndex + 1} element:`, slide);
    console.log(`Slide ${slideIndex + 1} classes:`, slide.className);
    console.log(`Slide ${slideIndex + 1} is active:`, slide.classList.contains('active'));
    
    const particleContainer = slide.querySelector('#particles-js, .particles-container, [id^="particles-js"]');
    
    if (!particleContainer) {
        console.warn(`No particle container found in slide ${slideIndex + 1}`);
        console.log(`Available elements in slide:`, slide.innerHTML);
        return;
    }
    
    const containerId = particleContainer.id || `particles-${slideIndex}`;
    console.log(`Found particle container: ${containerId}`);
    
    // Skip if already initialized
    if (initializedParticles.has(containerId)) {
        console.log(`Particles already initialized for ${containerId}`);
        return;
    }
    
    try {
        console.log(`Initializing particles for container: ${containerId}`);
        
        // Ensure container has proper dimensions
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        
        // Choose the appropriate configuration based on slide number
        let config;
        const slideNumber = slideIndex + 1;
        
        if (slideNumber === 2) {
            // Special configuration for Earth section (slide 2)
            config = earthParticlesConfig;
            console.log(`Using Earth particles config for slide ${slideNumber}`);
        } else if (slideNumber % 2 === 0) {
            // Even numbers (2, 4, 6, 8, 10) - dark slides
            config = darkParticlesConfig;
            console.log(`Using dark particles config for slide ${slideNumber}`);
        } else {
            // Odd numbers (1, 3, 5, 7, 9, 11) - light slides
            config = lightParticlesConfig;
            console.log(`Using light particles config for slide ${slideNumber}`);
        }
        
        // Initialize particles with the appropriate configuration
        particlesJS(containerId, config);
        
        // Mark as initialized
        initializedParticles.add(containerId);
        
        console.log(`Particles initialized successfully for slide ${slideIndex + 1}!`);
        
    } catch (error) {
        console.error(`Error initializing particles for slide ${slideIndex + 1}:`, error);
    }
}

function initAllParticles() {
    console.log('Initializing particles for all slides...');
    
    // Check if particlesJS is available
    if (typeof particlesJS === 'undefined') {
        console.error('particlesJS library not loaded!');
        return;
    }
    
    console.log('particlesJS library found, initializing...');
    
    // Initialize particles for the first slide immediately
    initParticlesForSlide(0);
}

// Function to initialize particles when slide becomes active
function onSlideChange(slideIndex) {
    console.log(`Slide changed to ${slideIndex + 1}, initializing particles...`);
    
    // Add a small delay to ensure the slide is fully visible
    setTimeout(() => {
        initParticlesForSlide(slideIndex);
    }, 100);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing particles...');
    
    // Check if particlesJS is available
    if (typeof particlesJS === 'undefined') {
        console.error('❌ particlesJS library not loaded!');
        return;
    }
    
    console.log('✅ particlesJS library found, initializing...');
    
    // Add a small delay to ensure everything is loaded
    setTimeout(initAllParticles, 500);
});

// Export functions for use by main.js
window.initParticlesForSlide = initParticlesForSlide;
window.onSlideChange = onSlideChange;

// Debug function to test particles manually
window.testParticles = function(slideIndex = 0) {
    console.log('🧪 Testing particles for slide', slideIndex + 1);
    const slide = document.querySelectorAll('.slide')[slideIndex];
    if (!slide) {
        console.error('Slide not found');
        return;
    }
    
    const container = slide.querySelector('.particles-container, #particles-js');
    if (!container) {
        console.error('Particle container not found');
        return;
    }
    
    console.log('Container found:', container);
    
    // Test with a simple configuration
    const testConfig = {
        particles: {
            number: { value: 50 },
            color: { value: '#00bfa6' },
            shape: { type: 'circle' },
            opacity: { value: 0.8 },
            size: { value: 3 },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00bfa6',
                opacity: 0.8,
                width: 2
            },
            move: {
                enable: true,
                speed: 1
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' }
            }
        }
    };
    
    try {
        particlesJS(container.id, testConfig);
        console.log('✅ Test particles initialized');
    } catch (error) {
        console.error('❌ Test particles failed:', error);
    }
};