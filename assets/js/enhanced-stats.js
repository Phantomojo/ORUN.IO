// Enhanced Stats with Three.js Animations and Smooth Counting
class EnhancedStats {
    constructor() {
        this.scenes = new Map();
        this.renderers = new Map();
        this.animations = new Map();
        this.isVisible = false;
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setupSmoothCounting();
        this.setupAnimeJS();
        this.setupIntersectionObserver();
    }

    setupThreeJS() {
        const canvases = document.querySelectorAll('.threejs-canvas');
        
        canvases.forEach(canvas => {
            const cardType = canvas.dataset.card;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas, 
                alpha: true, 
                antialias: true 
            });
            
            renderer.setSize(200, 200);
            renderer.setClearColor(0x000000, 0);
            
            this.scenes.set(cardType, scene);
            this.renderers.set(cardType, renderer);
            
            this.createCardAnimation(cardType, scene, camera);
        });
    }

    createCardAnimation(cardType, scene, camera) {
        let animation;
        
        switch(cardType) {
            case 'projects':
                animation = this.createProjectsAnimation(scene, camera);
                break;
            case 'people':
                animation = this.createPeopleAnimation(scene, camera);
                break;
            case 'investment':
                animation = this.createInvestmentAnimation(scene, camera);
                break;
        }
        
        this.animations.set(cardType, animation);
    }

    createProjectsAnimation(scene, camera) {
        const group = new THREE.Group();
        
        // Create floating project nodes
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 6);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x4CAF50,
                transparent: true,
                opacity: 0.8
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.set(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            );
            
            group.add(sphere);
        }
        
        // Create connecting lines
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.3
        });
        
        const points = [];
        for (let i = 0; i < 20; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            ));
        }
        
        lineGeometry.setFromPoints(points);
        const lines = new THREE.Line(lineGeometry, lineMaterial);
        group.add(lines);
        
        scene.add(group);
        camera.position.z = 5;
        
        return () => {
            group.rotation.x += 0.005;
            group.rotation.y += 0.01;
            group.rotation.z += 0.003;
            
            // Animate individual spheres
            group.children.forEach((child, index) => {
                if (child.geometry.type === 'SphereGeometry') {
                    child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                    child.material.opacity = 0.6 + Math.sin(Date.now() * 0.002 + index) * 0.2;
                }
            });
        };
    }

    createPeopleAnimation(scene, camera) {
        const group = new THREE.Group();
        
        // Create people representations
        for (let i = 0; i < 12; i++) {
            const geometry = new THREE.ConeGeometry(0.1, 0.3, 6);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x2196F3,
                transparent: true,
                opacity: 0.7
            });
            const cone = new THREE.Mesh(geometry, material);
            
            cone.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            );
            
            group.add(cone);
        }
        
        // Create network connections
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x2196F3,
            transparent: true,
            opacity: 0.4
        });
        
        const points = [];
        for (let i = 0; i < 15; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            ));
        }
        
        lineGeometry.setFromPoints(points);
        const lines = new THREE.Line(lineGeometry, lineMaterial);
        group.add(lines);
        
        scene.add(group);
        camera.position.z = 4;
        
        return () => {
            group.rotation.y += 0.008;
            group.rotation.x += 0.003;
            
            // Animate individual people
            group.children.forEach((child, index) => {
                if (child.geometry.type === 'ConeGeometry') {
                    child.position.y += Math.sin(Date.now() * 0.0015 + index) * 0.008;
                    child.rotation.y += 0.02;
                }
            });
        };
    }

    createInvestmentAnimation(scene, camera) {
        const group = new THREE.Group();
        
        // Create dollar signs
        for (let i = 0; i < 6; i++) {
            const geometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xFFC107,
                transparent: true,
                opacity: 0.8
            });
            const torus = new THREE.Mesh(geometry, material);
            
            torus.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            );
            
            group.add(torus);
        }
        
        // Create flowing particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 4;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFC107,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
        
        scene.add(group);
        camera.position.z = 5;
        
        return () => {
            group.rotation.x += 0.004;
            group.rotation.z += 0.006;
            
            // Animate particles
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
                positions[i] += Math.cos(Date.now() * 0.0008 + i) * 0.005;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        };
    }

    setupSmoothCounting() {
        const counters = document.querySelectorAll('.metric-value[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                // Format number with commas for large numbers
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(animate);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    setupAnimeJS() {
        const cards = document.querySelectorAll('.stat-card');
        
        cards.forEach((card, index) => {
            // Initial state
            anime.set(card, {
                translateY: 50,
                opacity: 0,
                scale: 0.8
            });
            
            // Hover animations
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -10,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
                
                // Animate the icon
                const icon = card.querySelector('.stat-placeholder');
                if (icon) {
                    anime({
                        targets: icon,
                        scale: 1.2,
                        rotate: 5,
                        duration: 200,
                        easing: 'easeOutBack'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
                
                const icon = card.querySelector('.stat-placeholder');
                if (icon) {
                    anime({
                        targets: icon,
                        scale: 1,
                        rotate: 0,
                        duration: 200,
                        easing: 'easeOutBack'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                    this.animateCardsIn();
                    this.startThreeJSAnimations();
                } else {
                    this.isVisible = false;
                    this.stopThreeJSAnimations();
                }
            });
        }, { threshold: 0.3 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCardsIn() {
        const cards = document.querySelectorAll('.stat-card');
        
        anime({
            targets: cards,
            translateY: [50, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'easeOutQuart'
        });
    }

    startThreeJSAnimations() {
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stopThreeJSAnimations() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.isVisible) return;
        
        this.animations.forEach((animation, cardType) => {
            animation();
            const renderer = this.renderers.get(cardType);
            const scene = this.scenes.get(cardType);
            if (renderer && scene) {
                renderer.render(scene, new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedStats();
});

