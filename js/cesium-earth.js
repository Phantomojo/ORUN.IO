/* ===== CESIUM EARTH IMPLEMENTATION ===== */

let cesiumViewer;
let isInitialized = false;

// Cesium token
const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZDM5NWIwMy03ZWY1LTQwMGQtYThiYi1hNGFkOTg1ZTg5YWMiLCJpZCI6MzM5OTAyLCJpYXQiOjE3NTc0NDg3MzB9.rfeA_lF3pbqGbATrzAVA4vcBDPQgEVXKsKTqaKq_aso';

function init3DEarth() {
    console.log('Initializing Cesium Earth...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found!');
        return;
    }
    
    // Set Cesium token
    Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
    
    try {
        // Create Cesium viewer
        cesiumViewer = new Cesium.Viewer(container, {
            // Disable default UI elements
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: true,
            shouldAnimate: true,
            
            // Use high-quality imagery
            imageryProvider: new Cesium.IonImageryProvider({ assetId: 1 }),
            
            // Terrain settings
            terrainProvider: Cesium.createWorldTerrain(),
            
            // Scene settings
            scene: {
                globe: {
                    enableLighting: true,
                    dynamicAtmosphereLighting: true,
                    dynamicAtmosphereLightingFromSun: true,
                    atmosphereLightIntensity: 10.0,
                    showGroundAtmosphere: true,
                    atmosphereMieCoefficient: new Cesium.Cartesian3(21e-6, 21e-6, 21e-6),
                    atmosphereMieScaleHeight: 1200.0,
                    atmosphereRayleighCoefficient: new Cesium.Cartesian3(5.5e-6, 13.0e-6, 28.4e-6),
                    atmosphereRayleighScaleHeight: 8000.0,
                    atmosphereSunIntensity: 20.0
                },
                skyAtmosphere: {
                    show: true,
                    brightnessShift: 0.0,
                    saturationShift: 0.0,
                    hueShift: 0.0
                },
                sun: {
                    show: true
                },
                moon: {
                    show: false
                },
                skyBox: {
                    show: false
                }
            }
        });
        
        // Set initial camera position to show Africa
        cesiumViewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(20.0, 0.0, 10000000), // Focus on Africa
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            }
        });
        
        // Add climate data visualization
        addClimateDataVisualization();
        
        // Add satellite data points
        addSatelliteDataPoints();
        
        // Add climate indicators
        addClimateIndicators();
        
        // Start rotation animation
        startEarthRotation();
        
        isInitialized = true;
        console.log('Cesium Earth initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing Cesium Earth:', error);
        // Fallback to Three.js if Cesium fails
        initThreeJSEarth();
    }
}

function addClimateDataVisualization() {
    // Add temperature data visualization
    const temperatureData = [
        { longitude: 36.8, latitude: -1.3, temperature: 25.5, name: 'Nairobi, Kenya' },
        { longitude: 3.4, latitude: 6.5, temperature: 28.2, name: 'Lagos, Nigeria' },
        { longitude: 28.2, latitude: -26.2, temperature: 22.1, name: 'Johannesburg, South Africa' },
        { longitude: 31.2, latitude: -29.9, temperature: 20.8, name: 'Cape Town, South Africa' },
        { longitude: 32.6, latitude: -15.4, temperature: 26.3, name: 'Lusaka, Zambia' }
    ];
    
    temperatureData.forEach(point => {
        const entity = cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
            point: {
                pixelSize: 15,
                color: getTemperatureColor(point.temperature),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
                text: `${point.name}\n${point.temperature}°C`,
                font: '12pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -40),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    });
}

function addSatelliteDataPoints() {
    // Add satellite data collection points
    const satellitePoints = [
        { longitude: 15.0, latitude: 0.0, type: 'satellite', name: 'Satellite 1' },
        { longitude: 30.0, latitude: -10.0, type: 'satellite', name: 'Satellite 2' },
        { longitude: 45.0, latitude: 5.0, type: 'satellite', name: 'Satellite 3' }
    ];
    
    satellitePoints.forEach(point => {
        cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, 1000000),
            point: {
                pixelSize: 8,
                color: Cesium.Color.CYAN,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            },
            label: {
                text: point.name,
                font: '10pt sans-serif',
                fillColor: Cesium.Color.CYAN,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30)
            }
        });
    });
}

function addClimateIndicators() {
    // Add climate change indicators
    const indicators = [
        { longitude: 20.0, latitude: -5.0, type: 'deforestation', severity: 'high' },
        { longitude: 35.0, latitude: -15.0, type: 'drought', severity: 'medium' },
        { longitude: 10.0, latitude: 10.0, type: 'flooding', severity: 'high' },
        { longitude: 40.0, latitude: -20.0, type: 'temperature', severity: 'medium' }
    ];
    
    indicators.forEach(indicator => {
        const color = getIndicatorColor(indicator.type, indicator.severity);
        cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(indicator.longitude, indicator.latitude),
            point: {
                pixelSize: 12,
                color: color,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    });
}

function getTemperatureColor(temperature) {
    if (temperature < 20) return Cesium.Color.BLUE;
    if (temperature < 25) return Cesium.Color.GREEN;
    if (temperature < 30) return Cesium.Color.YELLOW;
    return Cesium.Color.RED;
}

function getIndicatorColor(type, severity) {
    const colors = {
        deforestation: Cesium.Color.BROWN,
        drought: Cesium.Color.ORANGE,
        flooding: Cesium.Color.BLUE,
        temperature: Cesium.Color.RED
    };
    return colors[type] || Cesium.Color.WHITE;
}

function startEarthRotation() {
    // Slow rotation to show Earth's movement
    const startTime = Cesium.JulianDate.fromDate(new Date());
    const stopTime = Cesium.JulianDate.addSeconds(startTime, 3600, new Cesium.JulianDate());
    
    cesiumViewer.clock.startTime = startTime.clone();
    cesiumViewer.clock.stopTime = stopTime.clone();
    cesiumViewer.clock.currentTime = startTime.clone();
    cesiumViewer.clock.multiplier = 100; // Speed up time
    cesiumViewer.clock.shouldAnimate = true;
}

function destroyEarth() {
    if (cesiumViewer) {
        cesiumViewer.destroy();
        cesiumViewer = null;
    }
    isInitialized = false;
}

// Fallback Three.js implementation
function initThreeJSEarth() {
    console.log('Falling back to Three.js Earth...');
    // Call the existing Three.js implementation
    if (window.init3DEarthThreeJS) {
        window.init3DEarthThreeJS();
    }
}

// Export functions
window.init3DEarth = init3DEarth;
window.destroyEarth = destroyEarth;
