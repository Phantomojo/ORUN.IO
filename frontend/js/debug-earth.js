/**
 * Debug Earth Visualization - Simple version to test
 */

let scene, camera, renderer, earth;
let earthContainer, earthInitialized = false;

// Initialize 3D Earth
function init3DEarth() {
    console.log('DEBUG: Initializing Earth...');
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('DEBUG: Earth container not found');
        return;
    }
    
    console.log('DEBUG: Container found:', container);
    console.log('DEBUG: Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = null; // Transparent background
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create simple Earth geometry
        const geometry = new THREE.SphereGeometry(2.5, 64, 32);
        
        // Create simple material
        const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            shininess: 100,
            specular: 0x222222
        });
        
        // Create Earth mesh
        earth = new THREE.Mesh(geometry, material);
        scene.add(earth);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (earth) {
                earth.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        earthInitialized = true;
        console.log('DEBUG: Earth initialized successfully');
        
    } catch (error) {
        console.error('DEBUG: Error initializing Earth:', error);
    }
}

// Export functions for use by main.js
window.onSlideChangeEarth = function(slideIndex) {
    console.log('DEBUG: onSlideChangeEarth called with slideIndex:', slideIndex);
    console.log('DEBUG: earthInitialized:', earthInitialized);
    if (slideIndex === 1 && !earthInitialized) { // Slide 2 (0-indexed)
        console.log('DEBUG: Initializing Earth for slide 2');
        setTimeout(() => {
            init3DEarth();
        }, 100);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: Debug Earth script loaded');
});
