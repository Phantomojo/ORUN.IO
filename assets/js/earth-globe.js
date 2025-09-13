/**
 * ORUN.IO Frontend Earth Globe Integration
 * Based on standalone-phone-globe.html - optimized for frontend
 */

// Global variables
let globeRef;
let autoRotate = false;
let showPoints = true;
let showArcs = true;
let showLabels = false;
let currentMapStyle = 0;
let earthInitialized = false;

// Performance detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 4;
const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');

// Adaptive settings based on device capabilities
const getAdaptiveSettings = () => {
    if (isMobile || isLowEnd) {
        return {
            pointRadius: 0.2,
            pointAltitude: 0.005,
            arcDashLength: 0.3,
            arcDashGap: 0.3,
            labelSize: 0.3,
            maxCities: 15,
            pixelRatio: 1,
            antialias: false
        };
    } else {
        return {
            pointRadius: 0.3,
            pointAltitude: 0.01,
            arcDashLength: 0.4,
            arcDashGap: 0.2,
            labelSize: 0.5,
            maxCities: 28,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            antialias: true
        };
    }
};

// Get adaptive city data based on device capabilities
const getAdaptiveCityData = () => {
    const settings = getAdaptiveSettings();
    return cityData.slice(0, settings.maxCities);
};

// City data - optimized for frontend
const cityData = [
    { lat: 40.7128, lng: -74.0060, name: 'New York', country: 'USA', region: 'North America', population: '8.3M', color: '#ff6b6b' },
    { lat: 51.5074, lng: -0.1278, name: 'London', country: 'UK', region: 'Europe', population: '9.5M', color: '#4ecdc4' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', country: 'Japan', region: 'Asia', population: '37.4M', color: '#45b7d1' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', country: 'Australia', region: 'Oceania', population: '5.3M', color: '#96ceb4' },
    { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', population: '6.7M', color: '#feca57' },
    { lat: 55.7558, lng: 37.6176, name: 'Moscow', country: 'Russia', region: 'Europe', population: '12.5M', color: '#ff9ff3' },
    { lat: 19.0760, lng: 72.8777, name: 'Mumbai', country: 'India', region: 'Asia', population: '20.4M', color: '#54a0ff' },
    { lat: -26.2041, lng: 28.0473, name: 'Johannesburg', country: 'South Africa', region: 'Africa', population: '5.6M', color: '#5f27cd' },
    { lat: 48.8566, lng: 2.3522, name: 'Paris', country: 'France', region: 'Europe', population: '11.0M', color: '#26de81' },
    { lat: 39.9042, lng: 116.4074, name: 'Beijing', country: 'China', region: 'Asia', population: '21.5M', color: '#00d2d3' },
    { lat: 34.0522, lng: -118.2437, name: 'Los Angeles', country: 'USA', region: 'North America', population: '4.0M', color: '#ff6b6b' },
    { lat: 41.8781, lng: -87.6298, name: 'Chicago', country: 'USA', region: 'North America', population: '2.7M', color: '#ff6b6b' },
    { lat: 43.6532, lng: -79.3832, name: 'Toronto', country: 'Canada', region: 'North America', population: '2.9M', color: '#ff9f43' },
    { lat: 19.4326, lng: -99.1332, name: 'Mexico City', country: 'Mexico', region: 'North America', population: '9.2M', color: '#feca57' },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo', country: 'Brazil', region: 'South America', population: '12.3M', color: '#feca57' },
    { lat: -34.6118, lng: -58.3960, name: 'Buenos Aires', country: 'Argentina', region: 'South America', population: '3.1M', color: '#ff9ff3' },
    { lat: 52.5200, lng: 13.4050, name: 'Berlin', country: 'Germany', region: 'Europe', population: '3.7M', color: '#a55eea' },
    { lat: 41.9028, lng: 12.4964, name: 'Rome', country: 'Italy', region: 'Europe', population: '2.9M', color: '#ff9f43' },
    { lat: 40.4168, lng: -3.7038, name: 'Madrid', country: 'Spain', region: 'Europe', population: '6.6M', color: '#feca57' },
    { lat: 31.2304, lng: 121.4737, name: 'Shanghai', country: 'China', region: 'Asia', population: '24.3M', color: '#00d2d3' },
    { lat: 28.6139, lng: 77.2090, name: 'New Delhi', country: 'India', region: 'Asia', population: '32.9M', color: '#54a0ff' },
    { lat: 37.5665, lng: 126.9780, name: 'Seoul', country: 'South Korea', region: 'Asia', population: '9.7M', color: '#5f27cd' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore', country: 'Singapore', region: 'Asia', population: '5.9M', color: '#ff6b6b' },
    { lat: 6.5244, lng: 3.3792, name: 'Lagos', country: 'Nigeria', region: 'Africa', population: '15.4M', color: '#ff6b6b' },
    { lat: 30.0444, lng: 31.2357, name: 'Cairo', country: 'Egypt', region: 'Africa', population: '20.9M', color: '#26de81' },
    { lat: -37.8136, lng: 144.9631, name: 'Melbourne', country: 'Australia', region: 'Oceania', population: '5.2M', color: '#96ceb4' },
    { lat: -36.8485, lng: 174.7633, name: 'Auckland', country: 'New Zealand', region: 'Oceania', population: '1.7M', color: '#45b7d1' }
];

// City connections
const cityConnections = [
    { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, color: '#ff6b6b' },
    { startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503, color: '#4ecdc4' },
    { startLat: 35.6762, startLng: 139.6503, endLat: -33.8688, endLng: 151.2093, color: '#45b7d1' },
    { startLat: -33.8688, startLng: 151.2093, endLat: -22.9068, endLng: -43.1729, color: '#96ceb4' },
    { startLat: -22.9068, startLng: -43.1729, endLat: 55.7558, endLng: 37.6176, color: '#feca57' },
    { startLat: 55.7558, startLng: 37.6176, endLat: 19.0760, endLng: 72.8777, color: '#ff9ff3' },
    { startLat: 19.0760, startLng: 72.8777, endLat: -26.2041, endLng: 28.0473, color: '#54a0ff' },
    { startLat: -26.2041, startLng: 28.0473, endLat: 40.7128, endLng: -74.0060, color: '#5f27cd' }
];

// Map styles - using local files for offline use
const MAP_STYLES = [
    { name: "NASA Topography", url: "world-map-topography.jpg" },
    { name: "NASA Night Lights", url: "world-map-night.jpg" },
    { name: "NASA Blue Marble", url: "world-map-blue-marble.jpg" },
    { name: "Political Map", url: "world-map-political.png" },
    { name: "Satellite View", url: "world-satellite-base.jpg" }
];

// Initialize the globe
function initEarthGlobe() {
    console.log('Initializing Earth Globe for frontend...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found');
        return;
    }
    
    // Check if React Globe.gl is available
    if (typeof window.React === 'undefined') {
        console.error('React not loaded');
        showGlobeError('React library not loaded');
        return;
    }
    
    if (typeof window.ReactDOM === 'undefined') {
        console.error('ReactDOM not loaded');
        showGlobeError('ReactDOM library not loaded');
        return;
    }
    
    if (typeof window.Globe === 'undefined') {
        console.error('React Globe.gl not loaded');
        showGlobeError('Globe library not loaded');
        return;
    }
    
    console.log('All libraries loaded successfully');
    
    // Create React Globe component
    const GlobeComponent = () => {
        const adaptiveSettings = getAdaptiveSettings();
        const adaptiveCityData = getAdaptiveCityData();
        
        const [displaySettings, setDisplaySettings] = React.useState({
            showPoints: true,
            showArcs: true,
            showLabels: false,
            autoRotate: false,
            mapStyle: 0
        });
        
        React.useEffect(() => {
            // Update global state
            showPoints = displaySettings.showPoints;
            showArcs = displaySettings.showArcs;
            showLabels = displaySettings.showLabels;
            autoRotate = displaySettings.autoRotate;
            currentMapStyle = displaySettings.mapStyle;
            
            // Expose setDisplaySettings globally for control functions
            window.setDisplaySettings = setDisplaySettings;
        }, [displaySettings]);
        
        return React.createElement('div', {
            style: { width: '100%', height: '100%' }
        }, React.createElement(window.Globe, {
            ref: (ref) => { 
                globeRef = ref;
            },
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 'transparent',
            globeImageUrl: MAP_STYLES[displaySettings.mapStyle].url,
            pointsData: displaySettings.showPoints ? adaptiveCityData : [],
            arcsData: displaySettings.showArcs ? cityConnections : [],
            labelsData: displaySettings.showLabels ? adaptiveCityData.map(city => ({
                lat: city.lat,
                lng: city.lng,
                text: city.name,
                size: adaptiveSettings.labelSize,
                color: city.color
            })) : [],
            onGlobeReady: () => {
                console.log('Frontend Earth Globe ready!');
                earthInitialized = true;
                
                // Debug: Check globe state
                console.log('Globe ref:', globeRef);
                if (globeRef) {
                    console.log('Globe methods available:', Object.keys(globeRef));
                }
                
                // Performance optimizations
                if (globeRef) {
                    const settings = getAdaptiveSettings();
                    
                    try {
                        // Set pixel ratio based on device capabilities
                        if (globeRef.renderer) {
                            globeRef.renderer().setPixelRatio(settings.pixelRatio);
                            
                            // Configure antialiasing based on device
                            if (!settings.antialias) {
                                globeRef.renderer().antialias = false;
                            }
                        }
                        
                        // Optimize controls
                        if (globeRef.controls) {
                            const controls = globeRef.controls();
                            controls.enableDamping = true;
                            controls.dampingFactor = isMobile ? 0.2 : 0.1; // More damping on mobile
                            controls.enableZoom = true;
                            controls.minDistance = isMobile ? 2.0 : 1.5; // Further zoom on mobile
                            controls.maxDistance = isMobile ? 8 : 10;
                            
                            // Touch optimizations for mobile
                            if (isMobile && window.THREE) {
                                controls.touches = {
                                    ONE: window.THREE.TOUCH.ROTATE,
                                    TWO: window.THREE.TOUCH.DOLLY_PAN
                                };
                            }
                            
                            // Set up auto-rotation
                            if (displaySettings.autoRotate) {
                                controls.autoRotate = true;
                                controls.autoRotateSpeed = isMobile ? 0.2 : 0.3; // Slower on mobile
                            }
                        }
                        
                        console.log(`Globe optimized for: ${isMobile ? 'Mobile' : 'Desktop'} (${isLowEnd ? 'Low-end' : 'High-end'})`);
                        
                        // Start performance monitoring
                        monitorPerformance();
                        
                        // Debug: Check if globe is still visible after a delay
                        setTimeout(() => {
                            const container = document.getElementById('earth-container');
                            if (container) {
                                const canvas = container.querySelector('canvas');
                                if (canvas) {
                                    console.log('Globe canvas still present:', canvas);
                                    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
                                } else {
                                    console.error('Globe canvas disappeared!');
                                }
                            }
                        }, 2000);
                        
                    } catch (error) {
                        console.error('Error during globe optimization:', error);
                    }
                }
            },
            onError: (error) => {
                console.error('Globe error:', error);
            },
            onPointClick: (point) => {
                console.log('City clicked:', point);
                updateCityInfo(point);
            },
            pointColor: 'color',
            pointAltitude: adaptiveSettings.pointAltitude,
            pointRadius: adaptiveSettings.pointRadius,
            arcColor: 'color',
            arcDashLength: adaptiveSettings.arcDashLength,
            arcDashGap: adaptiveSettings.arcDashGap,
            arcDashAnimateTime: isMobile ? 3000 : 2000, // Slower animation on mobile
            labelText: 'text',
            labelSize: adaptiveSettings.labelSize,
            labelColor: 'color',
            labelAltitude: 0.02,
            enablePointerInteraction: true,
            animateIn: !isMobile, // Disable animation on mobile for better performance
            rendererConfig: {
                antialias: adaptiveSettings.antialias,
                alpha: true,
                powerPreference: isLowEnd ? 'low-power' : 'high-performance'
            },
            // Ensure proper globe appearance
            globeMaterial: {
                transparent: true,
                opacity: 1.0
            },
            // Add some lighting
            lightsData: [
                {
                    lat: 0,
                    lng: 0,
                    color: '#ffffff',
                    intensity: 1.0
                }
            ]
        }));
    };
    
    // Render the globe
    try {
        // Clear any existing content
        container.innerHTML = '';
        
        const root = window.ReactDOM.createRoot(container);
        root.render(React.createElement(GlobeComponent));
        console.log('Earth Globe rendered successfully');
        
        // Debug: Check if canvas is created
        setTimeout(() => {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                console.log('Canvas created successfully:', canvas);
                console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
                console.log('Canvas style:', canvas.style.cssText);
                
                // Check if canvas is actually rendering
                if (canvas.width === 0 || canvas.height === 0) {
                    console.error('Canvas has zero dimensions!');
                    showGlobeError('Globe failed to initialize properly. Canvas has zero dimensions.');
                }
            } else {
                console.error('No canvas found in container');
                showGlobeError('Globe failed to initialize. No canvas element created.');
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error rendering globe:', error);
        showGlobeError('Failed to render globe: ' + error.message);
    }
}

// Update city information (if info panel exists)
function updateCityInfo(city) {
    // This could be expanded to show city info in a modal or panel
    console.log('City info:', city);
}

// Show globe loading message
function showGlobeLoading(message) {
    const container = document.getElementById('earth-container');
    if (container) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #00BFA6;
                text-align: center;
                padding: 2rem;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 20px;
                border: 1px solid #00BFA6;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #00BFA6;
                    border-top: 3px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                "></div>
                <h3 style="margin-bottom: 1rem; color: #00BFA6;">Loading Globe</h3>
                <p style="margin-bottom: 1rem; color: #e0e0e0;">${message}</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
}

// Show globe error message
function showGlobeError(message) {
    const container = document.getElementById('earth-container');
    if (container) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #ff6b6b;
                text-align: center;
                padding: 2rem;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 20px;
                border: 1px solid #ff6b6b;
            ">
                <h3 style="margin-bottom: 1rem; color: #ff6b6b;">Globe Loading Error</h3>
                <p style="margin-bottom: 1rem; color: #e0e0e0;">${message}</p>
                <button onclick="location.reload()" style="
                    padding: 0.8rem 1.5rem;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Retry</button>
            </div>
        `;
    }
}

// Control functions - connected to frontend buttons
function toggleGlobeCities() {
    if (window.setDisplaySettings) {
        window.setDisplaySettings(prev => ({
            ...prev,
            showPoints: !prev.showPoints
        }));
    }
}

function toggleGlobeConnections() {
    if (window.setDisplaySettings) {
        window.setDisplaySettings(prev => ({
            ...prev,
            showArcs: !prev.showArcs
        }));
    }
}

function changeGlobeMapStyle() {
    if (window.setDisplaySettings) {
        window.setDisplaySettings(prev => {
            const newMapStyle = (prev.mapStyle + 1) % MAP_STYLES.length;
            return {
                ...prev,
                mapStyle: newMapStyle
            };
        });
    }
}

// Export functions for use by main.js
window.onSlideChangeEarth = function(slideIndex) {
    console.log('onSlideChangeEarth called with slideIndex:', slideIndex);
    if (slideIndex === 1 && !earthInitialized) { // Slide 2 (0-indexed)
        console.log('Initializing Earth for slide 2');
        
        // Check if globe is already rendered
        const container = document.getElementById('earth-container');
        if (container && container.querySelector('canvas')) {
            console.log('Globe already rendered, skipping initialization');
            earthInitialized = true;
            return;
        }
        
        // Show loading message immediately
        showGlobeLoading('Loading libraries...');
        
        // Wait for libraries to load with timeout
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds max wait
        
        const checkLibraries = () => {
            attempts++;
            
            // Check each library individually
            const reactLoaded = typeof window.React !== 'undefined';
            const reactDomLoaded = typeof window.ReactDOM !== 'undefined';
            const globeLoaded = typeof window.Globe !== 'undefined';
            
            console.log(`Library check ${attempts}/${maxAttempts}:`, {
                React: reactLoaded,
                ReactDOM: reactDomLoaded,
                Globe: globeLoaded
            });
            
            if (reactLoaded && reactDomLoaded && globeLoaded) {
                console.log('All libraries ready, initializing globe...');
                showGlobeLoading('Initializing 3D Globe...');
                initEarthGlobe();
            } else if (attempts < maxAttempts) {
                const missingLibs = [];
                if (!reactLoaded) missingLibs.push('React');
                if (!reactDomLoaded) missingLibs.push('ReactDOM');
                if (!globeLoaded) missingLibs.push('Globe');
                
                console.log(`Waiting for libraries to load... (attempt ${attempts}/${maxAttempts})`);
                showGlobeLoading(`Loading ${missingLibs.join(', ')}... (${attempts}/${maxAttempts})`);
                setTimeout(checkLibraries, 500);
            } else {
                console.error('Libraries failed to load after maximum attempts');
                const missingLibs = [];
                if (!reactLoaded) missingLibs.push('React');
                if (!reactDomLoaded) missingLibs.push('ReactDOM');
                if (!globeLoaded) missingLibs.push('Globe');
                
                showGlobeError(`Failed to load: ${missingLibs.join(', ')}. Please check your internet connection and refresh the page.`);
            }
        };
        
        // Start checking after a short delay
        setTimeout(checkLibraries, 1000);
    }
};

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function monitorPerformance() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    frameCount++;
    if (frameCount % 60 === 0) {
        fps = Math.round(1000 / deltaTime);
        
        // Auto-optimize based on performance
        if (fps < 30 && !isLowEnd) {
            console.log('Low FPS detected, applying performance optimizations...');
            // Could implement dynamic quality reduction here
        }
    }
    
    if (earthInitialized) {
        requestAnimationFrame(monitorPerformance);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (globeRef && earthInitialized) {
        const container = document.getElementById('earth-container');
        if (container) {
            // Use the correct method to resize the globe
            if (globeRef.width && globeRef.height) {
                globeRef.width(container.clientWidth);
                globeRef.height(container.clientHeight);
            } else if (globeRef.renderer) {
                // Alternative method if width/height methods don't exist
                globeRef.renderer().setSize(container.clientWidth, container.clientHeight);
            }
        }
    }
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden && globeRef) {
        // Pause animations when tab is not visible
        if (globeRef.controls) {
            globeRef.controls().autoRotate = false;
        }
    } else if (!document.hidden && globeRef && autoRotate) {
        // Resume animations when tab becomes visible
        if (globeRef.controls) {
            globeRef.controls().autoRotate = true;
        }
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Earth Globe script loaded');
    
    // Test library availability after a delay
    setTimeout(() => {
        console.log('Library availability test:', {
            React: typeof window.React !== 'undefined',
            ReactDOM: typeof window.ReactDOM !== 'undefined',
            Globe: typeof window.Globe !== 'undefined',
            THREE: typeof window.THREE !== 'undefined'
        });
    }, 3000);
});
