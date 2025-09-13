/**
 * Simple 3D Globe Implementation using Three.js
 * Based on proven working examples
 */

let scene, camera, renderer, globe, controls, raycaster, mouse;
let earthInitialized = false;
let cityPoints = [];
let showCities = true;
let showConnections = false;
let autoRotate = true; // Enable auto-rotate by default
let projectMarkers = [];
let climateData = [];
let showClimateData = true;

// Initialize the simple globe
function initSimpleGlobe() {
    console.log('Initializing Simple Globe...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 2.5; // Closer for better default view
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create globe geometry with default size
    const globeRadius = 1.2; // Slightly larger default size
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 32);
    
    // Create earth texture with multiple fallbacks
    const textureLoader = new THREE.TextureLoader();
    const textureOptions = [
        'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
        'world-map-topography.jpg',
        'world-map-8k.jpg',
        'world-map-4k.jpg',
        'world-map-blue-marble.jpg',
        'world-map-satellite-political.jpg'
    ];
    
    let textureIndex = 0;
    
    function tryLoadTexture() {
        if (textureIndex >= textureOptions.length) {
            console.warn('All texture options failed, using fallback');
            createFallbackGlobe(geometry);
            return;
        }
        
        const texturePath = textureOptions[textureIndex];
        console.log(`Attempting to load texture: ${texturePath}`);
        
        const earthTexture = textureLoader.load(
            texturePath,
            () => {
                console.log(`✅ Earth texture loaded successfully: ${texturePath}`);
                createGlobeWithTexture(geometry, earthTexture);
            },
            undefined,
            (error) => {
                console.warn(`❌ Failed to load texture ${texturePath}:`, error);
                textureIndex++;
                tryLoadTexture();
            }
        );
    }
    
    tryLoadTexture();
}

// Create globe with loaded texture
function createGlobeWithTexture(geometry, texture) {
    // Enhance texture settings
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    // Create enhanced material with multiple maps
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 1.0,
        shininess: 30,
        specular: new THREE.Color(0x222222),
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.1
    });
    
    // Create globe mesh
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add atmosphere effect
    addAtmosphereEffect();
    
    // Add enhanced lighting
    addEnhancedLighting();
    
    // Initialize raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add city points
    addCityPoints();
    
    // Add project markers
    addProjectMarkers();
    
    // Add climate data visualization
    addClimateData();
    
    // Add mouse interaction
    addMouseInteraction();
    
    // Add enhanced controls
    try {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.minDistance = 1.0;
        controls.maxDistance = 15;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.rotateSpeed = 1.0; // Increased for better responsiveness
        controls.zoomSpeed = 1.0;
        controls.panSpeed = 0.8;
        controls.autoRotate = true; // Enable auto-rotate by default
        controls.autoRotateSpeed = 0.5;
        controls.enableKeys = true;
        controls.keys = {
            LEFT: 'ArrowLeft',
            UP: 'ArrowUp', 
            RIGHT: 'ArrowRight',
            BOTTOM: 'ArrowDown'
        };
        
        // Ensure controls are properly attached
        controls.update();
        console.log('Enhanced OrbitControls initialized successfully');
        console.log('Controls object:', controls);
        console.log('Controls enabled:', {
            rotate: controls.enableRotate,
            zoom: controls.enableZoom,
            pan: controls.enablePan,
            autoRotate: controls.autoRotate
        });
        console.log('🔄 Auto-rotate is ENABLED by default');
    } catch (error) {
        console.error('OrbitControls initialization failed:', error);
        console.log('OrbitControls not available, using manual rotation only');
    }
    
    // Start animation
    animate();
    
    earthInitialized = true;
    console.log('Simple Globe initialized successfully');
    
    // Set default view
    setDefaultView();
    
    // Show help panel
    showHelpPanel();
    
    // Update timestamp
    updateLastUpdated();
    
    // Add panel scroll isolation
    addPanelScrollIsolation();
}

// Create fallback globe if texture fails
function createFallbackGlobe(geometry) {
    console.log('Creating fallback globe with solid color');
    
    const material = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        shininess: 30,
        specular: new THREE.Color(0x222222)
    });
    
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add atmosphere effect
    addAtmosphereEffect();
    
    // Add enhanced lighting
    addEnhancedLighting();
}

// Add atmosphere effect around the globe
function addAtmosphereEffect() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.25, 32, 16);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00BFA6,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    
    // Animate atmosphere
    function animateAtmosphere() {
        atmosphere.rotation.y += 0.001;
        requestAnimationFrame(animateAtmosphere);
    }
    animateAtmosphere();
}

// Add enhanced lighting system
function addEnhancedLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Secondary light for better illumination
    const secondaryLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    secondaryLight.position.set(-3, 2, -2);
    scene.add(secondaryLight);
    
    // Point light for dynamic lighting
    const pointLight = new THREE.PointLight(0x00BFA6, 0.5, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animate point light
    function animatePointLight() {
        const time = Date.now() * 0.001;
        pointLight.position.x = Math.sin(time) * 3;
        pointLight.position.z = Math.cos(time) * 3;
        requestAnimationFrame(animatePointLight);
    }
    animatePointLight();
}

// Add city points (Africa only)
function addCityPoints() {
    const cityData = [
        { lat: -26.2041, lng: 28.0473, name: 'Johannesburg', country: 'South Africa', color: 0x5f27cd },
        { lat: -33.9249, lng: 18.4241, name: 'Cape Town', country: 'South Africa', color: 0x5f27cd },
        { lat: -1.2921, lng: 36.8219, name: 'Nairobi', country: 'Kenya', color: 0x5f27cd },
        { lat: 6.5244, lng: 3.3792, name: 'Lagos', country: 'Nigeria', color: 0x5f27cd },
        { lat: -15.3767, lng: 28.2833, name: 'Lusaka', country: 'Zambia', color: 0x5f27cd },
        { lat: -4.0435, lng: 39.6682, name: 'Mombasa', country: 'Kenya', color: 0x5f27cd }
    ];
    
    cityData.forEach(city => {
        const point = latLngToVector3(city.lat, city.lng, 1.25); // Adjusted for larger globe
        const geometry = new THREE.SphereGeometry(0.015, 4, 3); // Ultra-small city points
        const material = new THREE.MeshBasicMaterial({ 
            color: city.color,
            transparent: true,
            opacity: 0.4
        });
        const cityPoint = new THREE.Mesh(geometry, material);
        cityPoint.position.copy(point);
        cityPoint.userData = city;
        cityPoint.name = city.name;
        cityPoints.push(cityPoint);
        scene.add(cityPoint);
        
        // Add city label (ultra-minimized)
        addCityLabel(city, point);
    });
}

// Add city labels (ultra-minimized)
function addCityLabel(city, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 80;
    canvas.height = 20;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#ffffff';
    context.font = '8px Arial';
    context.textAlign = 'center';
    context.fillText(city.name, canvas.width / 2, 14);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.multiplyScalar(1.15); // Adjusted for larger globe
    sprite.scale.set(0.08, 0.03, 1); // Ultra-small labels
    sprite.userData = { type: 'label', city: city };
    scene.add(sprite);
}

// Add project markers for ORUN.IO projects
function addProjectMarkers() {
    const projectData = [
        { lat: -1.2921, lng: 36.8219, name: 'Makueni', country: 'Kenya', type: 'water', color: 0x00BFA6 },
        { lat: 6.5244, lng: 3.3792, name: 'Lagos', country: 'Nigeria', type: 'energy', color: 0xFFD700 },
        { lat: -15.3767, lng: 28.2833, name: 'Lusaka', country: 'Zambia', type: 'forest', color: 0x32CD32 },
        { lat: -26.2041, lng: 28.0473, name: 'Johannesburg', country: 'South Africa', type: 'agriculture', color: 0xFF6347 }
    ];
    
    projectData.forEach(project => {
        const point = latLngToVector3(project.lat, project.lng, 1.3);
        
        // Create project marker (ultra-small and subtle)
        const geometry = new THREE.SphereGeometry(0.02, 4, 3);
        const material = new THREE.MeshBasicMaterial({ 
            color: project.color,
            transparent: true,
            opacity: 0.5
        });
        const projectMarker = new THREE.Mesh(geometry, material);
        projectMarker.position.copy(point);
        projectMarker.userData = { ...project, type: 'project' };
        projectMarker.name = project.name;
        projectMarkers.push(projectMarker);
        scene.add(projectMarker);
        
        // Add subtle pulsing animation
        animateProjectMarker(projectMarker);
        
        // Add project label (ultra-minimized)
        addProjectLabel(project, point);
    });
}

// Add project labels (ultra-minimized)
function addProjectLabel(project, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 60;
    canvas.height = 16;
    
    context.fillStyle = 'rgba(0, 191, 166, 0.4)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#ffffff';
    context.font = '7px Arial';
    context.textAlign = 'center';
    context.fillText(project.name, canvas.width / 2, 11);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.multiplyScalar(1.2);
    sprite.scale.set(0.1, 0.04, 1); // Ultra-small labels
    sprite.userData = { type: 'project-label', project: project };
    scene.add(sprite);
}

// Animate project markers with subtle pulsing effect
function animateProjectMarker(marker) {
    const originalScale = marker.scale.clone();
    let time = 0;
    
    function pulse() {
        time += 0.03;
        const scale = 1 + Math.sin(time) * 0.1; // More subtle pulsing
        marker.scale.copy(originalScale).multiplyScalar(scale);
        requestAnimationFrame(pulse);
    }
    pulse();
}

// Add climate data visualization
function addClimateData() {
    const climatePoints = [
        { lat: 15.0, lng: 30.0, type: 'drought', severity: 'high', color: 0xFF4500 },
        { lat: -5.0, lng: 20.0, type: 'flood', severity: 'medium', color: 0x4169E1 },
        { lat: 10.0, lng: 10.0, type: 'temperature', severity: 'high', color: 0xFF6347 },
        { lat: -20.0, lng: 25.0, type: 'rainfall', severity: 'low', color: 0x87CEEB }
    ];
    
    climatePoints.forEach(climate => {
        const point = latLngToVector3(climate.lat, climate.lng, 1.15);
        
        // Create climate indicator (smaller)
        const geometry = new THREE.RingGeometry(0.015, 0.03, 6);
        const material = new THREE.MeshBasicMaterial({ 
            color: climate.color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const climateIndicator = new THREE.Mesh(geometry, material);
        climateIndicator.position.copy(point);
        climateIndicator.userData = { ...climate, type: 'climate' };
        climateData.push(climateIndicator);
        scene.add(climateIndicator);
        
        // Add rotation animation
        animateClimateIndicator(climateIndicator);
    });
}

// Animate climate indicators
function animateClimateIndicator(indicator) {
    function rotate() {
        indicator.rotation.z += 0.02;
        requestAnimationFrame(rotate);
    }
    rotate();
}

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat, lng, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// Add mouse interaction
function addMouseInteraction() {
    const container = document.getElementById('earth-container');
    
    // Mouse move for hover effects (with throttling to avoid conflicts)
    let mouseMoveTimeout;
    container.addEventListener('mousemove', (event) => {
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => onMouseMove(event), 16); // ~60fps
    });
    
    // Click for city selection (with small delay to avoid conflicts with OrbitControls)
    container.addEventListener('click', (event) => {
        setTimeout(() => onMouseClick(event), 50);
    });
    
    // Touch events for mobile
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
}

// Mouse move handler
function onMouseMove(event) {
    const container = document.getElementById('earth-container');
    const rect = container.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find hovered objects
    raycaster.setFromCamera(mouse, camera);
    const allInteractiveObjects = [...cityPoints, ...projectMarkers, ...climateData];
    const intersects = raycaster.intersectObjects(allInteractiveObjects);
    
    // Reset all interactive objects
    cityPoints.forEach(point => {
        point.material.opacity = 0.8;
        point.scale.set(1, 1, 1);
    });
    
    projectMarkers.forEach(marker => {
        marker.material.opacity = 0.9;
    });
    
    climateData.forEach(indicator => {
        indicator.material.opacity = 0.7;
    });
    
    // Highlight hovered object
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.type === 'project') {
            object.material.opacity = 1.0;
        } else if (object.userData.type === 'climate') {
            object.material.opacity = 1.0;
        } else {
            object.material.opacity = 1.0;
            object.scale.set(1.5, 1.5, 1.5);
        }
        container.style.cursor = 'pointer';
    } else {
        container.style.cursor = 'grab';
    }
}

// Mouse click handler
function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const allInteractiveObjects = [...cityPoints, ...projectMarkers, ...climateData];
    const intersects = raycaster.intersectObjects(allInteractiveObjects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        const data = object.userData;
        
        if (data.type === 'project') {
            showProjectInfo(data);
        } else if (data.type === 'climate') {
            showClimateInfo(data);
        } else {
            showCityInfo(data);
        }
    }
}

// Touch handlers for mobile
function onTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const container = document.getElementById('earth-container');
    const rect = container.getBoundingClientRect();
    
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
}

function onTouchEnd(event) {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cityPoints);
    
    if (intersects.length > 0) {
        const city = intersects[0].object.userData;
        showCityInfo(city);
    }
}

// Show city information
function showCityInfo(city) {
    console.log('City clicked:', city);
    
    // Create or update info panel
    let infoPanel = document.getElementById('city-info-panel');
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.id = 'city-info-panel';
        infoPanel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #00BFA6;
            z-index: 1000;
            min-width: 200px;
            font-family: Arial, sans-serif;
        `;
        document.getElementById('earth-container').appendChild(infoPanel);
    }
    
    infoPanel.innerHTML = `
        <h3 style="color: #00BFA6; margin: 0 0 10px 0;">${city.name}</h3>
        <p style="margin: 5px 0;"><strong>Country:</strong> ${city.country}</p>
        <p style="margin: 5px 0;"><strong>Population:</strong> ${city.population}</p>
        <p style="margin: 5px 0;"><strong>Coordinates:</strong> ${city.lat.toFixed(2)}°, ${city.lng.toFixed(2)}°</p>
        <button onclick="this.parentElement.remove()" style="
            background: #00BFA6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        ">Close</button>
    `;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (infoPanel && infoPanel.parentElement) {
            infoPanel.remove();
        }
    }, 5000);
}

// Show project information
function showProjectInfo(project) {
    console.log('Project clicked:', project);
    
    let infoPanel = document.getElementById('project-info-panel');
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.id = 'project-info-panel';
        infoPanel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 191, 166, 0.95);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #00BFA6;
            z-index: 1000;
            min-width: 250px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0, 191, 166, 0.3);
        `;
        document.getElementById('earth-container').appendChild(infoPanel);
    }
    
    const typeIcon = {
        'water': '💧',
        'energy': '⚡',
        'forest': '🌳',
        'agriculture': '🌱'
    };
    
    infoPanel.innerHTML = `
        <h3 style="color: white; margin: 0 0 10px 0;">${typeIcon[project.type]} ${project.name}</h3>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${project.country}</p>
        <p style="margin: 5px 0;"><strong>Type:</strong> ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
        <p style="margin: 5px 0;"><strong>Impact:</strong> ${project.impact}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #32CD32;">Active</span></p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #00BFA6;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: bold;
        ">Learn More</button>
    `;
    
    setTimeout(() => {
        if (infoPanel && infoPanel.parentElement) {
            infoPanel.remove();
        }
    }, 8000);
}

// Show climate information
function showClimateInfo(climate) {
    console.log('Climate data clicked:', climate);
    
    let infoPanel = document.getElementById('climate-info-panel');
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.id = 'climate-info-panel';
        infoPanel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 99, 71, 0.95);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #FF6347;
            z-index: 1000;
            min-width: 250px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(255, 99, 71, 0.3);
        `;
        document.getElementById('earth-container').appendChild(infoPanel);
    }
    
    const typeIcon = {
        'drought': '🌵',
        'flood': '🌊',
        'temperature': '🌡️',
        'rainfall': '🌧️'
    };
    
    const severityColor = {
        'high': '#FF4500',
        'medium': '#FFA500',
        'low': '#32CD32'
    };
    
    infoPanel.innerHTML = `
        <h3 style="color: white; margin: 0 0 10px 0;">${typeIcon[climate.type]} ${climate.type.charAt(0).toUpperCase() + climate.type.slice(1)} Alert</h3>
        <p style="margin: 5px 0;"><strong>Severity:</strong> <span style="color: ${severityColor[climate.severity]};">${climate.severity.toUpperCase()}</span></p>
        <p style="margin: 5px 0;"><strong>Coordinates:</strong> ${climate.lat.toFixed(2)}°, ${climate.lng.toFixed(2)}°</p>
        <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #FFD700;">Monitoring</span></p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #FF6347;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: bold;
        ">View Details</button>
    `;
    
    setTimeout(() => {
        if (infoPanel && infoPanel.parentElement) {
            infoPanel.remove();
        }
    }, 6000);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotate if enabled (backup rotation if OrbitControls fails)
    if (globe && autoRotate && (!controls || !controls.autoRotate)) {
        globe.rotation.y += 0.005;
    }
    
    // Update controls
    if (controls) {
        controls.update();
    }
    
    // Render
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer && earthInitialized) {
        const container = document.getElementById('earth-container');
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
});

// Export functions for use by main.js
window.onSlideChangeEarth = function(slideIndex) {
    console.log('onSlideChangeEarth called with slideIndex:', slideIndex);
    if (slideIndex === 1 && !earthInitialized) { // Slide 2 (0-indexed)
        console.log('Initializing Simple Globe for slide 2');
        setTimeout(() => {
            initSimpleGlobe();
        }, 100);
    }
};

// Control functions
function toggleGlobeCities() {
    showCities = !showCities;
    cityPoints.forEach(point => {
        point.visible = showCities;
    });
    console.log('Cities toggled:', showCities ? 'ON' : 'OFF');
}

function toggleGlobeConnections() {
    showConnections = !showConnections;
    console.log('Connections toggled:', showConnections ? 'ON' : 'OFF');
    // TODO: Implement connection lines between cities
}

function toggleProjectMarkers() {
    projectMarkers.forEach(marker => {
        marker.visible = !marker.visible;
    });
    console.log('Project markers toggled:', projectMarkers[0]?.visible ? 'ON' : 'OFF');
}

function toggleClimateData() {
    showClimateData = !showClimateData;
    climateData.forEach(indicator => {
        indicator.visible = showClimateData;
    });
    console.log('Climate data toggled:', showClimateData ? 'ON' : 'OFF');
}

function changeGlobeMapStyle() {
    console.log('Change map style - feature coming soon');
    // TODO: Implement different map textures
}

function toggleAutoRotate() {
    autoRotate = !autoRotate;
    if (controls) {
        controls.autoRotate = autoRotate;
    }
    console.log('Auto-rotate toggled:', autoRotate ? 'ON' : 'OFF');
}

function setDefaultView() {
    if (camera && controls) {
        // Set a nice default view showing Africa and Europe
        camera.position.set(2, 1, 2);
        controls.target.set(0, 0, 0);
        controls.update();
        console.log('Default view set');
    }
}

function resetGlobeView() {
    if (controls) {
        controls.reset();
        setDefaultView(); // Apply our custom default view
    }
    console.log('Globe view reset to default');
}

// Add keyboard controls
document.addEventListener('keydown', (event) => {
    if (!earthInitialized) return;
    
    switch(event.key) {
        case 'r':
        case 'R':
            resetGlobeView();
            break;
        case 'a':
        case 'A':
            toggleAutoRotate();
            break;
        case 'c':
        case 'C':
            toggleGlobeCities();
            break;
        case 'l':
        case 'L':
            toggleClimateData();
            break;
        case 'p':
        case 'P':
            toggleProjectMarkers();
            break;
        case 'm':
        case 'M':
            changeGlobeMapStyle();
            break;
        case ' ':
            event.preventDefault();
            toggleAutoRotate();
            break;
    }
});

// Show help panel
function showHelpPanel() {
    const container = document.getElementById('earth-container');
    const helpPanel = document.createElement('div');
    helpPanel.id = 'globe-help-panel';
    helpPanel.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #00BFA6;
        z-index: 1000;
        font-family: Arial, sans-serif;
        font-size: 12px;
        max-width: 250px;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    helpPanel.innerHTML = `
        <h4 style="color: #00BFA6; margin: 0 0 10px 0;">🌍 Interactive Globe</h4>
        <div style="margin: 3px 0;"><strong>🖱️ Mouse:</strong> Drag to rotate, scroll to zoom</div>
        <div style="margin: 3px 0;"><strong>👆 Click:</strong> Cities, Projects, Climate data</div>
        <div style="margin: 3px 0;"><strong>🏙️ Cities:</strong> Major world cities</div>
        <div style="margin: 3px 0;"><strong>💧 Projects:</strong> ORUN.IO active projects</div>
        <div style="margin: 3px 0;"><strong>🌡️ Climate:</strong> Real-time monitoring</div>
        <div style="margin: 3px 0;"><strong>⌨️ R:</strong> Reset view | <strong>A:</strong> Toggle auto-rotate (ON)</div>
        <div style="margin: 3px 0;"><strong>⌨️ C:</strong> Cities | <strong>P:</strong> Projects | <strong>L:</strong> Climate</div>
        <button onclick="this.parentElement.style.opacity = '0'; setTimeout(() => this.parentElement.remove(), 300)" style="
            background: #00BFA6;
            color: white;
            border: none;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 8px;
            font-size: 10px;
        ">Hide</button>
    `;
    
    container.appendChild(helpPanel);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (helpPanel && helpPanel.parentElement) {
            helpPanel.style.opacity = '0';
            setTimeout(() => helpPanel.remove(), 300);
        }
    }, 10000);
}

// Update last updated timestamp
function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        lastUpdatedElement.textContent = now.toLocaleString();
    }
}

// Add panel scroll isolation to prevent page scrolling when hovering over panel
function addPanelScrollIsolation() {
    const panel = document.querySelector('.earth-overlay');
    if (!panel) return;
    
    let isOverPanel = false;
    
    // Mouse enter panel
    panel.addEventListener('mouseenter', () => {
        isOverPanel = true;
        document.body.style.overflow = 'hidden';
        console.log('Panel scroll isolation: ON');
    });
    
    // Mouse leave panel
    panel.addEventListener('mouseleave', () => {
        isOverPanel = false;
        document.body.style.overflow = 'auto';
        console.log('Panel scroll isolation: OFF');
    });
    
    // Prevent wheel events from bubbling to page when over panel
    panel.addEventListener('wheel', (event) => {
        if (isOverPanel) {
            event.stopPropagation();
            
            // Check if panel is at scroll limits
            const { scrollTop, scrollHeight, clientHeight } = panel;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight;
            
            // If at limits and trying to scroll further, allow page scroll
            if ((event.deltaY < 0 && isAtTop) || (event.deltaY > 0 && isAtBottom)) {
                document.body.style.overflow = 'auto';
                // Temporarily re-enable page scroll for this event
                setTimeout(() => {
                    if (isOverPanel) {
                        document.body.style.overflow = 'hidden';
                    }
                }, 100);
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Globe script loaded');
    console.log('Keyboard controls: R=Reset, A=Auto-rotate, C=Cities, P=Projects, L=Climate, M=Map style, Space=Toggle auto-rotate');
});
