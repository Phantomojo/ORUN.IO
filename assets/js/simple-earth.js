/* ===== SIMPLE GUARANTEED EARTH IMPLEMENTATION ===== */

let scene, camera, renderer, earth, animationId;

// Create realistic Earth texture
function createRealisticEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create realistic ocean background with depth
    const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
    oceanGradient.addColorStop(0, '#0f172a');
    oceanGradient.addColorStop(0.3, '#1e3a8a');
    oceanGradient.addColorStop(0.7, '#3b82f6');
    oceanGradient.addColorStop(1, '#1e40af');
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add realistic continents with varied terrain colors
    // Africa - more detailed shape
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(1024, 640, 170, 380, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add desert regions in Africa
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(1000, 600, 80, 120, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe - more detailed
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(1000, 240, 130, 90, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia - larger and more detailed
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(1440, 400, 260, 180, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add Asian mountain regions
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(1400, 350, 100, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // North America
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(400, 300, 180, 260, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add North American mountain ranges
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(350, 250, 60, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(500, 700, 110, 220, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(1640, 800, 140, 90, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add realistic cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 60 + 20;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add more detailed cloud formations
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 100 + 40;
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

function createNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Dark background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add realistic city lights with different intensities
    const cities = [
        // Africa
        {x: 1024, y: 640, size: 6, intensity: 0.8},
        {x: 1000, y: 600, size: 4, intensity: 0.6},
        {x: 1050, y: 680, size: 3, intensity: 0.5},
        
        // Europe
        {x: 1000, y: 240, size: 8, intensity: 1.0},
        {x: 950, y: 200, size: 5, intensity: 0.7},
        {x: 1050, y: 280, size: 4, intensity: 0.6},
        
        // Asia
        {x: 1440, y: 400, size: 10, intensity: 1.0},
        {x: 1400, y: 350, size: 6, intensity: 0.8},
        {x: 1480, y: 450, size: 5, intensity: 0.7},
        
        // North America
        {x: 400, y: 300, size: 8, intensity: 0.9},
        {x: 350, y: 250, size: 6, intensity: 0.7},
        {x: 450, y: 350, size: 4, intensity: 0.6},
        
        // South America
        {x: 500, y: 700, size: 6, intensity: 0.7},
        {x: 450, y: 650, size: 4, intensity: 0.5},
        
        // Australia
        {x: 1640, y: 800, size: 4, intensity: 0.6}
    ];
    
    cities.forEach(city => {
        ctx.fillStyle = `rgba(255, 255, 136, ${city.intensity})`;
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add glow effect
        ctx.fillStyle = `rgba(255, 255, 136, ${city.intensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size * 2, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    
    return texture;
}

function createNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create a more detailed normal map
    const gradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
    gradient.addColorStop(0, '#8080ff');
    gradient.addColorStop(0.5, '#8080ff');
    gradient.addColorStop(1, '#8080ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add some terrain variation
    ctx.fillStyle = '#8080ff';
    for (let i = 0; i < 50; i++) {
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

function init3DEarth() {
    console.log('Initializing simple Earth...');
    
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found!');
        console.log('Available elements with "earth" in ID:', 
            Array.from(document.querySelectorAll('[id*="earth"]')).map(el => el.id));
        return;
    }
    
    console.log('Container found:', container);
    console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    
    try {
        // Create scene with transparent background
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
            antialias: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add renderer to container
        container.appendChild(renderer.domElement);
        console.log('Renderer added to container');
        
        // Create large, high-detail Earth sphere
        const geometry = new THREE.SphereGeometry(2.5, 128, 64);
        
        // Create realistic Earth texture
        const earthTexture = createRealisticEarthTexture();
        const nightTexture = createNightTexture();
        const normalTexture = createNormalTexture();
        
        // Create professional material with multiple textures
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            normalMap: normalTexture,
            shininess: 1000,
            specular: new THREE.Color(0x222222),
            transparent: true,
            opacity: 1.0
        });
        
        earth = new THREE.Mesh(geometry, material);
        earth.castShadow = true;
        earth.receiveShadow = true;
        scene.add(earth);
        
        // Add night side
        const nightMaterial = new THREE.MeshBasicMaterial({
            map: nightTexture,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const nightEarth = new THREE.Mesh(geometry, nightMaterial);
        scene.add(nightEarth);
        
        console.log('Realistic Earth sphere created and added to scene');
        
        // Add realistic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        
        // Main sun light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);
        
        // Secondary light for better illumination
        const pointLight = new THREE.PointLight(0x87ceeb, 0.3, 10);
        pointLight.position.set(-3, 2, 3);
        scene.add(pointLight);
        
        // Start animation
        animate();
        console.log('Animation started');
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        console.log('Simple Earth initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing simple Earth:', error);
        
        // Ultimate fallback - create a simple colored div
        createUltimateFallback();
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (earth) {
        earth.rotation.y += 0.01;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    const container = document.getElementById('earth-container');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function createUltimateFallback() {
    console.log('Creating ultimate fallback...');
    
    const container = document.getElementById('earth-container');
    if (!container) return;
    
    // Create a simple CSS-based Earth
    const fallbackEarth = document.createElement('div');
    fallbackEarth.style.cssText = `
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #87ceeb, #4a90e2, #2e8b57);
        position: relative;
        animation: rotate 20s linear infinite;
        box-shadow: 0 0 50px rgba(0, 191, 166, 0.3);
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(fallbackEarth);
    console.log('Ultimate fallback Earth created');
}

function destroyEarth() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    window.removeEventListener('resize', onWindowResize);
}

// Export functions
window.init3DEarth = init3DEarth;
window.destroyEarth = destroyEarth;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, attempting to initialize Earth...');
    setTimeout(init3DEarth, 1000);
});

// Also initialize when slide 2 becomes active
function onSlideChangeEarth(slideIndex) {
    console.log(`Earth: Slide changed to ${slideIndex + 1}`);
    if (slideIndex === 1) { // Slide 2 (0-indexed)
        console.log('Slide 2 active, initializing Earth...');
        setTimeout(init3DEarth, 100);
    }
}

// Export for use by main.js
window.onSlideChangeEarth = onSlideChangeEarth;
