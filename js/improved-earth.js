/**
 * Improved Earth Visualization based on 2050.earth analysis
 * Features: Realistic textures, multiple layers, better lighting, hexasphere geometry
 */

let scene, camera, renderer, earth, controls;
let earthContainer, earthInitialized = false;

// Earth configuration
const EARTH_CONFIG = {
    radius: 2.5,
    segments: 128,
    rings: 64,
    rotationSpeed: 0.001,
    cloudSpeed: 0.0005,
    nightOpacity: 0.3
};

// Create realistic Earth texture with high detail
function createRealisticEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create ocean background with realistic depth gradients
    const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1000);
    oceanGradient.addColorStop(0, '#0a1a2e');
    oceanGradient.addColorStop(0.2, '#16213e');
    oceanGradient.addColorStop(0.4, '#1e3a8a');
    oceanGradient.addColorStop(0.6, '#3b82f6');
    oceanGradient.addColorStop(0.8, '#1e40af');
    oceanGradient.addColorStop(1, '#1e3a8a');
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add realistic continents with varied terrain
    ctx.fillStyle = '#2d5016'; // Dark forest green
    // North America
    ctx.beginPath();
    ctx.ellipse(300, 200, 120, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.ellipse(400, 600, 80, 200, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(1000, 150, 60, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Africa
    ctx.beginPath();
    ctx.ellipse(1100, 400, 100, 300, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(1400, 200, 200, 150, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(1600, 700, 80, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add terrain variation
    ctx.fillStyle = '#4a7c59'; // Lighter green for forests
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add desert areas
    ctx.fillStyle = '#d4a574'; // Desert color
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 15 + 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add mountain ranges
    ctx.fillStyle = '#8b7355'; // Mountain color
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 10 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add realistic cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add more subtle clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 20 + 5;
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
    texture.anisotropy = 16;
    
    return texture;
}

// Create night lights texture
function createNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Fill with transparent background
    ctx.clearRect(0, 0, 2048, 1024);
    
    // Add city lights with realistic distribution
    ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
    
    // North America lights
    for (let i = 0; i < 30; i++) {
        const x = 200 + Math.random() * 200;
        const y = 150 + Math.random() * 100;
        const size = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Europe lights
    for (let i = 0; i < 25; i++) {
        const x = 950 + Math.random() * 100;
        const y = 120 + Math.random() * 80;
        const size = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Asia lights
    for (let i = 0; i < 40; i++) {
        const x = 1300 + Math.random() * 300;
        const y = 150 + Math.random() * 200;
        const size = Math.random() * 4 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add glow effects
    ctx.shadowColor = 'rgba(255, 255, 200, 0.5)';
    ctx.shadowBlur = 10;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
}

// Create normal map for realistic lighting
function createNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create a more detailed normal map
    const imageData = ctx.createImageData(2048, 1024);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % 2048;
        const y = Math.floor((i / 4) / 2048);
        
        // Create terrain variation
        const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 0.5 + 0.5;
        const height = noise * 255;
        
        // Normal map: R=X, G=Y, B=Z
        data[i] = 128;     // R
        data[i + 1] = 128; // G  
        data[i + 2] = height; // B (height)
        data[i + 3] = 255; // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
}

// Create cloud layer
function createCloudLayer() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 40 + 20;
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

// Initialize the improved Earth
function initImprovedEarth() {
    console.log('Initializing improved Earth...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found');
        return;
    }
    
    console.log('Container found:', container);
    console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    
    try {
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
        camera.position.z = 6;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Create Earth geometry with high detail
        const geometry = new THREE.SphereGeometry(
            EARTH_CONFIG.radius, 
            EARTH_CONFIG.segments, 
            EARTH_CONFIG.rings
        );
        
        // Create textures
        const earthTexture = createRealisticEarthTexture();
        const nightTexture = createNightTexture();
        const normalTexture = createNormalTexture();
        const cloudTexture = createCloudLayer();
        
        // Create Earth material with enhanced properties
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            normalMap: normalTexture,
            shininess: 1000,
            specular: new THREE.Color(0x222222),
            transparent: true,
            opacity: 1.0
        });
        
        // Create Earth mesh
        earth = new THREE.Mesh(geometry, material);
        earth.castShadow = true;
        earth.receiveShadow = true;
        scene.add(earth);
        
        // Create night lights layer
        const nightMaterial = new THREE.MeshBasicMaterial({
            map: nightTexture,
            transparent: true,
            opacity: EARTH_CONFIG.nightOpacity,
            blending: THREE.AdditiveBlending
        });
        const nightEarth = new THREE.Mesh(geometry, nightMaterial);
        scene.add(nightEarth);
        
        // Create cloud layer (slightly larger)
        const cloudGeometry = new THREE.SphereGeometry(
            EARTH_CONFIG.radius * 1.01, 
            EARTH_CONFIG.segments, 
            EARTH_CONFIG.rings
        );
        const cloudMaterial = new THREE.MeshBasicMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);
        
        // Add realistic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate Earth
            earth.rotation.y += EARTH_CONFIG.rotationSpeed;
            nightEarth.rotation.y += EARTH_CONFIG.rotationSpeed;
            clouds.rotation.y += EARTH_CONFIG.cloudSpeed;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        earthInitialized = true;
        console.log('Improved Earth initialized successfully');
        
    } catch (error) {
        console.error('Error initializing improved Earth:', error);
    }
}

// Export function for slide changes
window.onSlideChangeEarth = function(slideIndex) {
    console.log('Earth slide change:', slideIndex);
    
    if (slideIndex === 1) { // Slide 2 (0-indexed)
        if (!earthInitialized) {
            setTimeout(() => {
                initImprovedEarth();
            }, 100);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, improved Earth script ready');
});
