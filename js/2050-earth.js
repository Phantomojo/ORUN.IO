/**
 * Earth Visualization based on 2050.earth implementation
 * Using their actual shaders and techniques
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

// Custom Earth Material using 2050.earth shader techniques
class EarthMaterial extends THREE.ShaderMaterial {
    constructor() {
        const uniforms = {
            time: { value: 0.0 },
            earthTexture: { value: null },
            nightTexture: { value: null },
            cloudTexture: { value: null },
            normalTexture: { value: null },
            specularTexture: { value: null },
            atmosphereColor: { value: new THREE.Color(0.3, 0.6, 1.0) },
            sunDirection: { value: new THREE.Vector3(1, 0, 0) },
            cameraPosition: { value: new THREE.Vector3() }
        };

        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float time;
            uniform sampler2D earthTexture;
            uniform sampler2D nightTexture;
            uniform sampler2D cloudTexture;
            uniform sampler2D normalTexture;
            uniform sampler2D specularTexture;
            uniform vec3 atmosphereColor;
            uniform vec3 sunDirection;
            uniform vec3 cameraPosition;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            void main() {
                // Sample textures
                vec4 earthColor = texture2D(earthTexture, vUv);
                vec4 nightColor = texture2D(nightTexture, vUv);
                vec4 cloudColor = texture2D(cloudTexture, vUv);
                vec3 normal = normalize(texture2D(normalTexture, vUv).rgb * 2.0 - 1.0);
                float specular = texture2D(specularTexture, vUv).r;
                
                // Calculate lighting
                vec3 lightDir = normalize(sunDirection);
                float NdotL = max(dot(normal, lightDir), 0.0);
                
                // Day/night transition
                float dayNight = smoothstep(-0.1, 0.1, NdotL);
                
                // Combine day and night textures
                vec3 finalColor = mix(nightColor.rgb, earthColor.rgb, dayNight);
                
                // Add clouds with animation
                vec2 cloudUV = vUv + vec2(time * 0.1, 0.0);
                vec4 clouds = texture2D(cloudTexture, cloudUV);
                finalColor = mix(finalColor, vec3(1.0), clouds.a * 0.3);
                
                // Add specular highlights
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                vec3 reflectDir = reflect(-lightDir, normal);
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
                finalColor += spec * specular * 0.5;
                
                // Add atmosphere glow
                float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
                finalColor += atmosphereColor * fresnel * 0.3;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        super({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: false
        });
    }
}

// Create realistic Earth texture
function createRealisticEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create ocean background with realistic depth
    const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1000);
    oceanGradient.addColorStop(0, '#0a1a2e');
    oceanGradient.addColorStop(0.3, '#1e3a8a');
    oceanGradient.addColorStop(0.7, '#3b82f6');
    oceanGradient.addColorStop(1, '#1e40af');
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add realistic continents with varied terrain
    ctx.fillStyle = '#2d5016'; // Dark forest green
    ctx.beginPath();
    // Africa
    ctx.ellipse(1024, 600, 200, 300, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.fillStyle = '#3a5f2a';
    ctx.beginPath();
    ctx.ellipse(950, 400, 150, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.ellipse(1200, 450, 300, 200, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // North America
    ctx.fillStyle = '#3a5f2a';
    ctx.beginPath();
    ctx.ellipse(300, 300, 250, 200, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.ellipse(400, 700, 150, 250, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.fillStyle = '#3a5f2a';
    ctx.beginPath();
    ctx.ellipse(1400, 750, 120, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add mountain ranges
    ctx.fillStyle = '#8b7355';
    ctx.beginPath();
    ctx.ellipse(1100, 500, 200, 50, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add desert areas
    ctx.fillStyle = '#d2b48c';
    ctx.beginPath();
    ctx.ellipse(1000, 550, 100, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
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
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add city lights
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 3 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Add major city clusters
    const cities = [
        {x: 950, y: 400, size: 8}, // Europe
        {x: 1200, y: 450, size: 10}, // Asia
        {x: 300, y: 300, size: 8}, // North America
        {x: 400, y: 700, size: 6}, // South America
        {x: 1400, y: 750, size: 4} // Australia
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

// Create cloud texture
function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Transparent background
    ctx.clearRect(0, 0, 2048, 1024);
    
    // Add cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 100 + 50;
        
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

// Create normal map
function createNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Base normal (flat)
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add terrain variation
    ctx.fillStyle = '#8080ff';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 50 + 20;
        
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

// Create specular map
function createSpecularTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Black background (no specular)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add water specular highlights
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
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
    
    return texture;
}

// Initialize 3D Earth
function init3DEarth() {
    console.log('Initializing 2050.earth style Earth...');
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
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Create Earth geometry
        const geometry = new THREE.SphereGeometry(EARTH_CONFIG.radius, EARTH_CONFIG.segments, EARTH_CONFIG.rings);
        
        // Create custom Earth material
        const material = new EarthMaterial();
        
        // Set textures
        material.uniforms.earthTexture.value = createRealisticEarthTexture();
        material.uniforms.nightTexture.value = createNightTexture();
        material.uniforms.cloudTexture.value = createCloudTexture();
        material.uniforms.normalTexture.value = createNormalTexture();
        material.uniforms.specularTexture.value = createSpecularTexture();
        
        // Create Earth mesh
        earth = new THREE.Mesh(geometry, material);
        earth.castShadow = true;
        earth.receiveShadow = true;
        scene.add(earth);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);
        
        // Set sun direction for shader
        material.uniforms.sunDirection.value = directionalLight.position.clone().normalize();
        
        // Add point light for additional illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (earth) {
                // Rotate Earth
                earth.rotation.y += EARTH_CONFIG.rotationSpeed;
                
                // Update shader uniforms
                material.uniforms.time.value += 0.01;
                material.uniforms.cameraPosition.value.copy(camera.position);
            }
            
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
        console.log('2050.earth style Earth initialized successfully');
        
    } catch (error) {
        console.error('Error initializing 2050.earth style Earth:', error);
    }
}

// Export functions for use by main.js
window.onSlideChangeEarth = function(slideIndex) {
    if (slideIndex === 1 && !earthInitialized) { // Slide 2 (0-indexed)
        setTimeout(() => {
            init3DEarth();
        }, 100);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('2050.earth style Earth script loaded');
});
