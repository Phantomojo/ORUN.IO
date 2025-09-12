/* ===== ROBUST OFFLINE-CAPABLE EARTH IMPLEMENTATION ===== */

let earthScene, earthCamera, earthRenderer, earthSphere, earthAtmosphere;
let animationId;
let isInitialized = false;

// Offline texture data - procedural Earth generation
function createOfflineEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create realistic Earth-like texture
    const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 400);
    gradient.addColorStop(0, '#4a90e2'); // Ocean blue
    gradient.addColorStop(0.3, '#5ba3f5');
    gradient.addColorStop(0.7, '#87ceeb');
    gradient.addColorStop(1, '#4682b4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add continents with realistic shapes
    ctx.fillStyle = '#228b22';
    
    // Africa (more detailed)
    ctx.beginPath();
    ctx.ellipse(520, 320, 80, 180, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(500, 120, 60, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(700, 200, 120, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // North America
    ctx.beginPath();
    ctx.ellipse(200, 150, 80, 120, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.ellipse(250, 350, 50, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(800, 400, 60, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add some cloud-like patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
}

function createNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Dark background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add city lights
    ctx.fillStyle = '#ffff88';
    const cities = [
        {x: 520, y: 320, size: 3}, // Africa
        {x: 500, y: 120, size: 2}, // Europe
        {x: 700, y: 200, size: 4}, // Asia
        {x: 200, y: 150, size: 3}, // North America
        {x: 250, y: 350, size: 2}, // South America
        {x: 800, y: 400, size: 1}  // Australia
    ];
    
    cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
}

function init3DEarth() {
    console.log('Initializing robust offline-capable Earth...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found!');
        return;
    }
    
    try {
        // Scene setup
        earthScene = new THREE.Scene();
        earthScene.background = new THREE.Color(0x000011);
        
        // Camera setup
        earthCamera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        earthCamera.position.z = 3;
        
        // Renderer setup
        earthRenderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        earthRenderer.setSize(container.clientWidth, container.clientHeight);
        earthRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        earthRenderer.shadowMap.enabled = true;
        earthRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        earthRenderer.outputEncoding = THREE.sRGBEncoding;
        earthRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        earthRenderer.toneMappingExposure = 1.0;
        
        container.appendChild(earthRenderer.domElement);
        
        // Create Earth sphere with offline textures
        createEarthSphere();
        
        // Add realistic lighting
        setupLighting();
        
        // Add atmosphere
        createAtmosphere();
        
        // Add climate data points
        addClimateDataPoints();
        
        // Start animation
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        isInitialized = true;
        console.log('Robust Earth initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing Earth:', error);
        // Fallback to simple sphere
        createSimpleEarth();
    }
}

function createEarthSphere() {
    // Create sphere geometry with high detail
    const geometry = new THREE.SphereGeometry(1, 128, 64);
    
    // Create materials with offline textures
    const dayTexture = createOfflineEarthTexture();
    const nightTexture = createNightTexture();
    
    // Create realistic Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: dayTexture,
        shininess: 100,
        transparent: true,
        opacity: 0.95
    });
    
    // Create Earth mesh
    earthSphere = new THREE.Mesh(geometry, earthMaterial);
    earthSphere.castShadow = true;
    earthSphere.receiveShadow = true;
    earthScene.add(earthSphere);
    
    // Add night side
    const nightMaterial = new THREE.MeshBasicMaterial({
        map: nightTexture,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const nightSphere = new THREE.Mesh(geometry, nightMaterial);
    earthScene.add(nightSphere);
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    earthScene.add(ambientLight);
    
    // Main sun light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    earthScene.add(directionalLight);
    
    // Secondary light for better illumination
    const pointLight = new THREE.PointLight(0x87ceeb, 0.2, 10);
    pointLight.position.set(-3, 2, 3);
    earthScene.add(pointLight);
}

function createAtmosphere() {
    // Create atmosphere sphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
                gl_FragColor = vec4(atmosphere, 1.0);
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    
    earthAtmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthScene.add(earthAtmosphere);
}

function addClimateDataPoints() {
    // Add climate monitoring points
    const climatePoints = [
        { lat: -1.3, lon: 36.8, name: 'Nairobi', temp: 25.5, color: 0xff6b6b },
        { lat: 6.5, lon: 3.4, name: 'Lagos', temp: 28.2, color: 0xffd700 },
        { lat: -26.2, lon: 28.2, name: 'Johannesburg', temp: 22.1, color: 0x00d4ff },
        { lat: -15.4, lon: 32.6, name: 'Lusaka', temp: 26.3, color: 0x90ee90 }
    ];
    
    climatePoints.forEach(point => {
        // Convert lat/lon to 3D position
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lon + 180) * (Math.PI / 180);
        
        const x = 1.02 * Math.sin(phi) * Math.cos(theta);
        const y = 1.02 * Math.cos(phi);
        const z = 1.02 * Math.sin(phi) * Math.sin(theta);
        
        // Create marker
        const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: point.color
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);
        earthScene.add(marker);
        
        // Add pulsing effect
        marker.userData = { originalScale: 1, pulseSpeed: 0.02 };
    });
}

function createSimpleEarth() {
    console.log('Creating simple fallback Earth...');
    
    const container = document.getElementById('earth-container');
    if (!container) return;
    
    // Simple colored sphere as fallback
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.8
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    camera.position.z = 3;
    renderer.setSize(container.clientWidth, container.clientHeight);
    scene.add(sphere);
    container.appendChild(renderer.domElement);
    
    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}

function animate() {
    if (!isInitialized) return;
    
    animationId = requestAnimationFrame(animate);
    
    // Rotate Earth
    if (earthSphere) {
        earthSphere.rotation.y += 0.005;
    }
    
    // Rotate atmosphere
    if (earthAtmosphere) {
        earthAtmosphere.rotation.y += 0.007;
        if (earthAtmosphere.material.uniforms) {
            earthAtmosphere.material.uniforms.time.value += 0.01;
        }
    }
    
    // Animate climate markers
    earthScene.children.forEach(child => {
        if (child.userData && child.userData.pulseSpeed) {
            child.userData.originalScale += child.userData.pulseSpeed;
            if (child.userData.originalScale > 1.5 || child.userData.originalScale < 0.5) {
                child.userData.pulseSpeed *= -1;
            }
            child.scale.setScalar(child.userData.originalScale);
        }
    });
    
    // Render scene
    earthRenderer.render(earthScene, earthCamera);
}

function onWindowResize() {
    if (!isInitialized) return;
    
    const container = document.getElementById('earth-container');
    if (!container || !earthCamera || !earthRenderer) return;
    
    earthCamera.aspect = container.clientWidth / container.clientHeight;
    earthCamera.updateProjectionMatrix();
    earthRenderer.setSize(container.clientWidth, container.clientHeight);
}

function destroyEarth() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (earthRenderer) {
        earthRenderer.dispose();
    }
    
    if (earthScene) {
        earthScene.clear();
    }
    
    window.removeEventListener('resize', onWindowResize);
    isInitialized = false;
}

// Export functions
window.init3DEarth = init3DEarth;
window.destroyEarth = destroyEarth;
