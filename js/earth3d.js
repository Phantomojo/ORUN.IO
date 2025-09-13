/* ===== 3D EARTH COMPONENT ===== */

let scene, camera, renderer, earth, animationId;

function init3DEarth() {
    const container = document.getElementById('earth-container');
    if (!container) return;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create Earth geometry
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    
    // Create realistic Earth material with multiple textures
    const textureLoader = new THREE.TextureLoader();
    
    const dayTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const nightTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.jpg');
    const normalTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    const specularTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
    
    // Configure textures
    [dayTexture, nightTexture, normalTexture, specularTexture].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
    });
    
    const material = new THREE.MeshPhongMaterial({
        map: dayTexture,
        normalMap: normalTexture,
        specularMap: specularTexture,
        shininess: 100,
        transparent: true,
        opacity: 0.95
    });
    
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // Add wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: '#00bfa6',
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireframeEarth = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeEarth);
    
    // Add continent outlines
    addContinentOutlines(scene);
    
    // Add Africa highlight
    const africaGeometry = new THREE.SphereGeometry(1.51, 32, 32);
    const africaMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const africa = new THREE.Mesh(africaGeometry, africaMaterial);
    scene.add(africa);
    
    // Add realistic atmosphere with shader
    const atmosphereGeometry = new THREE.SphereGeometry(1.55, 64, 64);
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
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    
    // Add data rings
    addDataRings(scene);
    
    // Add climate indicators
    addClimateIndicators(scene);
    
    // Position camera
    camera.position.z = 3;
    
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
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createEarthTexture() {
    // Use realistic Earth texture from NASA
    const textureLoader = new THREE.TextureLoader();
    
    // High-resolution Earth texture
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;
    earthTexture.generateMipmaps = true;
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.anisotropy = 16;
    
    return earthTexture;
}

function addContinentOutlines(scene) {
    const outlineGeometry = new THREE.SphereGeometry(1.501, 64, 64);
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    scene.add(outline);
    
    // Add country/region markers
    const markers = [
        { lat: -2.0, lon: 37.5, name: 'Kenya', color: 0xff6b6b },
        { lat: 5.5, lon: 6.4, name: 'Nigeria', color: 0xffd700 },
        { lat: -20.0, lon: 24.0, name: 'Botswana', color: 0x00d4ff },
        { lat: -1.0, lon: 35.0, name: 'Tanzania', color: 0xff6b6b },
        { lat: 6.0, lon: 2.0, name: 'Benin', color: 0xffd700 }
    ];
    
    markers.forEach(marker => {
        const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: marker.color
        });
        const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
        
        // Convert lat/lon to 3D position
        const phi = (90 - marker.lat) * (Math.PI / 180);
        const theta = (marker.lon + 180) * (Math.PI / 180);
        
        markerMesh.position.x = 1.52 * Math.sin(phi) * Math.cos(theta);
        markerMesh.position.y = 1.52 * Math.cos(phi);
        markerMesh.position.z = 1.52 * Math.sin(phi) * Math.sin(theta);
        
        scene.add(markerMesh);
    });
}

function addDataRings(scene) {
    // Temperature ring
    const tempRingGeometry = new THREE.RingGeometry(2.2, 2.3, 32);
    const tempRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const tempRing = new THREE.Mesh(tempRingGeometry, tempRingMaterial);
    tempRing.rotation.x = Math.PI / 2;
    scene.add(tempRing);
    
    // Carbon ring
    const carbonRingGeometry = new THREE.RingGeometry(2.4, 2.5, 32);
    const carbonRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const carbonRing = new THREE.Mesh(carbonRingGeometry, carbonRingMaterial);
    carbonRing.rotation.x = Math.PI / 2;
    scene.add(carbonRing);
    
    // Water ring
    const waterRingGeometry = new THREE.RingGeometry(2.6, 2.7, 32);
    const waterRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const waterRing = new THREE.Mesh(waterRingGeometry, waterRingMaterial);
    waterRing.rotation.x = Math.PI / 2;
    scene.add(waterRing);
}

function addClimateIndicators(scene) {
    const indicators = [
        { position: [3, 1, 0], color: 0xff6b6b, label: 'Temperature' },
        { position: [0, 1, 3], color: 0x00d4ff, label: 'Carbon' },
        { position: [-3, 1, 0], color: 0x4a90e2, label: 'Water' },
        { position: [0, 1, -3], color: 0x90EE90, label: 'Vegetation' }
    ];
    
    indicators.forEach(indicator => {
        // Create indicator sphere
        const indicatorGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: indicator.color
        });
        const indicatorMesh = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicatorMesh.position.set(...indicator.position);
        scene.add(indicatorMesh);
        
        // Create connecting line to Earth
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...indicator.position),
            new THREE.Vector3(0, 0, 0)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: indicator.color,
            transparent: true,
            opacity: 0.3
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (earth) {
        earth.rotation.y += 0.005;
    }
    
    // Rotate atmosphere slightly faster
    const atmosphere = scene.children.find(child => child.material && child.material.uniforms);
    if (atmosphere) {
        atmosphere.rotation.y += 0.007;
        if (atmosphere.material.uniforms && atmosphere.material.uniforms.time) {
            atmosphere.material.uniforms.time.value += 0.01;
        }
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Cleanup function
function destroy3DEarth() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
    window.removeEventListener('resize', onWindowResize);
}
