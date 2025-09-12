// Main Application Initialization
console.log('DOM loaded, initializing...');

// Custom Cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// Loading Screen Management
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const statusText = document.querySelector('.status-text');
    const globeLoader = document.querySelector('.globe-loader-container');
    
    console.log('Loading screen elements:', { loadingScreen, statusText, globeLoader });
    
    if (!loadingScreen || !statusText) {
        console.error('Loading screen elements not found!');
        setTimeout(initMainContent, 1000);
        return;
    }
    
    let messageIndex = 0;
    const loadingMessages = [
        'Initializing satellite networks...',
        'Connecting to climate data sources...',
        'Loading 3D Earth visualization...',
        'Verifying blockchain connections...',
        'Calibrating AI models...',
        'Preparing real-time monitoring...',
        'Ready to explore Africa\'s climate impact!'
    ];
    
    function updateLoadingMessage() {
        if (statusText && messageIndex < loadingMessages.length) {
            statusText.style.opacity = '0';
            statusText.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                statusText.textContent = loadingMessages[messageIndex];
                messageIndex++;
                
                statusText.style.opacity = '1';
                statusText.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    updateLoadingMessage();
    
    const messageInterval = setInterval(() => {
        updateLoadingMessage();
        
        if (messageIndex >= loadingMessages.length) {
            clearInterval(messageInterval);
            
            setTimeout(() => {
                loadingScreen.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (typeof destroyLoadingGlobe === 'function') {
                        destroyLoadingGlobe();
                    }
                    initMainContent();
                }, 1000);
            }, 2000);
        }
    }, 2000);
    
    // Allow skipping with spacebar
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && loadingScreen.style.display !== 'none') {
            e.preventDefault();
            clearInterval(messageInterval);
            loadingScreen.style.transition = 'all 0.5s ease-out';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (typeof destroyLoadingGlobe === 'function') {
                    destroyLoadingGlobe();
                }
                initMainContent();
            }, 500);
        }
    }, { once: true });
}

// Main Content Initialization
function initMainContent() {
    console.log('Loading screen hidden, starting main animations');
    
    try {
        // Initialize custom cursor
        initCustomCursor();
        
        // Initialize particles for all slides
        if (window.initParticlesForAllSlides) {
            window.initParticlesForAllSlides();
        }
        
        // Initialize stats animation
        if (window.initStatsAnimation) {
            window.initStatsAnimation();
        }
        
        console.log('✅ Main content initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing main content:', error);
    }
}

// Error Handling
function setupErrorBoundary() {
    window.addEventListener('error', (e) => {
        console.error('🚨 Global error caught:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('🚨 Unhandled promise rejection:', e.reason);
    });
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('📊 Performance metrics:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 1000);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Ensure loading screen is visible
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        loadingScreen.style.visibility = 'visible';
    }
    
    // Setup error handling
    setupErrorBoundary();
    
    // Monitor performance
    monitorPerformance();
    
    // Initialize loading screen
    initLoadingScreen();
    
    // Fallback timer
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('Loading screen fallback triggered');
            loadingScreen.style.display = 'none';
            initMainContent();
        }
    }, 10000);
});

// Window load event
window.addEventListener('load', () => {
    console.log('Window loaded, checking particlesJS...');
    
    if (typeof particlesJS !== 'undefined') {
        console.log('particlesJS available:', true);
        const container = document.getElementById('particles-js');
        console.log('particles container exists:', !!container);
    }
});