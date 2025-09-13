// Loading Globe - Simple 3D Earth for loading screen
let loadingScene, loadingCamera, loadingRenderer, loadingGlobe, loadingAnimationId;

function initLoadingGlobe() {
    const canvas = document.getElementById('loadingGlobe');
    if (!canvas) {
        console.warn('Loading globe canvas not found');
        return;
    }

    // Scene setup
    loadingScene = new THREE.Scene();
    loadingCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    loadingRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    
    loadingRenderer.setSize(150, 150);
    loadingRenderer.setClearColor(0x000000, 0);
    loadingRenderer.shadowMap.enabled = true;
    loadingRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create Earth geometry
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    
    // Try to load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const textureOptions = [
        'world-map-topography.jpg',
        'world-map-8k.jpg',
        'world-map-4k.jpg',
        'world-map-2k.jpg',
        'world-map-1k.jpg'
    ];
    
    let textureIndex = 0;
    
    function tryLoadTexture() {
        if (textureIndex >= textureOptions.length) {
            console.warn('All texture options failed, using fallback');
            createFallbackGlobe(geometry);
            return;
        }
        
        const texturePath = textureOptions[textureIndex];
        console.log(`Loading globe: Attempting to load texture: ${texturePath}`);
        
        // Create fallback globe immediately for faster loading
        createFallbackGlobe(geometry);
        
        const earthTexture = textureLoader.load(
            texturePath,
            () => {
                console.log(`✅ Loading globe texture loaded: ${texturePath}`);
                // Update the existing globe with texture
                if (loadingGlobe && loadingGlobe.material) {
                    loadingGlobe.material.map = earthTexture;
                    loadingGlobe.material.needsUpdate = true;
                }
            },
            undefined,
            (error) => {
                console.warn(`❌ Loading globe texture failed ${texturePath}:`, error);
                textureIndex++;
                // Don't retry - keep the fallback globe
            }
        );
    }
    
    function createGlobeWithTexture(geometry, texture) {
        // Configure texture
        texture.anisotropy = loadingRenderer.capabilities.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
        // Create bright, clear material with texture
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 100,
            specular: new THREE.Color(0x222222),
            emissive: new THREE.Color(0x000000) // No blue glow
        });
        
        loadingGlobe = new THREE.Mesh(geometry, material);
        loadingGlobe.castShadow = true;
        loadingGlobe.receiveShadow = true;
        loadingScene.add(loadingGlobe);
        
        // Add atmosphere
        addAtmosphere();
        
        // Add lighting
        addLighting();
        
        // Position camera
        loadingCamera.position.z = 2.5;
        
        // Start animation
        animateLoadingGlobe();
    }
    
    function createFallbackGlobe(geometry) {
        // Fallback material without texture - bright and clear
        const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            shininess: 100,
            specular: new THREE.Color(0x222222),
            emissive: new THREE.Color(0x000000) // No blue glow
        });
        
        loadingGlobe = new THREE.Mesh(geometry, material);
        loadingGlobe.castShadow = true;
        loadingGlobe.receiveShadow = true;
        loadingScene.add(loadingGlobe);
        
        // Add atmosphere
        addAtmosphere();
        
        // Add lighting
        addLighting();
        
        // Position camera
        loadingCamera.position.z = 2.5;
        
        // Start animation
        animateLoadingGlobe();
    }
    
    function addAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(1.1, 32, 16);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x00BFA6,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        loadingScene.add(atmosphere);
    }
    
    function addLighting() {
        // Bright ambient light to eliminate dark areas
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        loadingScene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        loadingScene.add(directionalLight);
        
        // Multiple fill lights for even illumination
        const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight1.position.set(-3, 2, -2);
        loadingScene.add(fillLight1);
        
        const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
        fillLight2.position.set(0, 5, 0);
        loadingScene.add(fillLight2);
    }
    
    function animateLoadingGlobe() {
        loadingAnimationId = requestAnimationFrame(animateLoadingGlobe);
        
        if (loadingGlobe) {
            // Slow, smooth rotation
            loadingGlobe.rotation.y += 0.005;
        }
        
        loadingRenderer.render(loadingScene, loadingCamera);
    }
    
    // Start loading
    tryLoadTexture();
}

function destroyLoadingGlobe() {
    if (loadingAnimationId) {
        cancelAnimationFrame(loadingAnimationId);
        loadingAnimationId = null;
    }
    
    if (loadingRenderer) {
        loadingRenderer.dispose();
        loadingRenderer = null;
    }
    
    if (loadingGlobe) {
        loadingGlobe.geometry.dispose();
        if (loadingGlobe.material.map) {
            loadingGlobe.material.map.dispose();
        }
        loadingGlobe.material.dispose();
        loadingGlobe = null;
    }
    
    loadingScene = null;
    loadingCamera = null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Loading globe script loaded');
    // Small delay to ensure Three.js is loaded
    setTimeout(() => {
        console.log('Initializing loading globe...');
        initLoadingGlobe();
    }, 500);
});
