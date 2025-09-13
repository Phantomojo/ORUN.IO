/* ===== CUSTOM CLIMATE-THEMED EFFECTS ===== */

class ClimateEffects {
    constructor() {
        this.effects = new Map();
        this.init();
    }
    
    init() {
        // Wait for Vanta.js to load with timeout
        if (typeof VANTA === 'undefined' && typeof vanta === 'undefined') {
            if (!this.retryCount) this.retryCount = 0;
            this.retryCount++;
            
            if (this.retryCount > 50) { // 5 second timeout
                console.warn('⚠️ Vanta.js failed to load after 5 seconds, skipping climate effects');
                return;
            }
            
            console.log('⏳ Waiting for Vanta.js to load...');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        console.log('🌍 Initializing climate-themed effects...');
        this.initializeClimateEffects();
    }
    
    initializeClimateEffects() {
        // Slide 1: Hero - 3D Box Dots (inside a cube)
        this.create3DBoxDots('vanta-hero', {
            color: 0x00bfa6,
            color2: 0x00d4ff,
            backgroundColor: 0xffffff,
            size: 1.5,
            spacing: 15,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            perspective: 800
        });
        
        // Slide 2: Earth - Ground View Dots (looking down)
        this.createGroundViewDots('vanta-earth', {
            color: 0x00bfa6,
            color2: 0x2ecc71,
            backgroundColor: 0x1a1a1a,
            size: 1.0,
            spacing: 20,
            showLines: false,
            mouseControls: false, // Don't interfere with globe
            touchControls: false,
            groundPerspective: true
        });
        
        // Slide 3: Stats - Climate Data Network
        this.createClimateNetwork('vanta-stats', {
            color: 0x00bfa6,
            backgroundColor: 0xffffff,
            points: 20,
            maxDistance: 35,
            spacing: 18,
            showDots: true,
            showLines: true,
            mouseControls: true,
            touchControls: true
        });
        
        // Slide 4: Projects - 3D Box Dots (inside a cube)
        this.create3DBoxDots('vanta-projects', {
            color: 0x00bfa6,
            color2: 0x00d4ff,
            backgroundColor: 0x1a1a1a,
            size: 1.3,
            spacing: 18,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            perspective: 600
        });
        
        // Slide 5: Technology - Ground View Dots (looking down)
        this.createGroundViewDots('vanta-tech', {
            color: 0x00d4ff,
            color2: 0x2ecc71,
            backgroundColor: 0xffffff,
            size: 1.2,
            spacing: 22,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            groundPerspective: true
        });
        
        // Slide 6: Impact - Impact Network
        this.createClimateNetwork('vanta-impact', {
            color: 0x2ecc71,
            backgroundColor: 0x1a1a1a,
            points: 16,
            maxDistance: 40,
            spacing: 20,
            showDots: true,
            showLines: true,
            mouseControls: true,
            touchControls: true
        });
        
        // Slide 7: Partners - 3D Box Dots (inside a cube)
        this.create3DBoxDots('vanta-partners', {
            color: 0x00bfa6,
            color2: 0xe0a82e,
            backgroundColor: 0xffffff,
            size: 1.4,
            spacing: 16,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            perspective: 700
        });
        
        // Slide 8: Team - Ground View Dots (looking down)
        this.createGroundViewDots('vanta-team', {
            color: 0x00bfa6,
            color2: 0x00d4ff,
            backgroundColor: 0x1a1a1a,
            size: 1.1,
            spacing: 24,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            groundPerspective: true
        });
        
        // Slide 9: Contact - Contact Network
        this.createClimateNetwork('vanta-contact', {
            color: 0x00d4ff,
            backgroundColor: 0xffffff,
            points: 14,
            maxDistance: 30,
            spacing: 16,
            showDots: true,
            showLines: true,
            mouseControls: true,
            touchControls: true
        });
        
        // Slide 10: Footer - 3D Box Dots (inside a cube)
        this.create3DBoxDots('vanta-footer', {
            color: 0x2ecc71,
            color2: 0x00bfa6,
            backgroundColor: 0x1a1a1a,
            size: 1.6,
            spacing: 14,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            perspective: 500
        });
        
        // Slide 11: Final - Ground View Dots (looking down)
        this.createGroundViewDots('vanta-final', {
            color: 0x00bfa6,
            color2: 0x2ecc71,
            backgroundColor: 0xffffff,
            size: 1.3,
            spacing: 20,
            showLines: false,
            mouseControls: true,
            touchControls: true,
            groundPerspective: true
        });
    }
    
    createClimateNetwork(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const effect = VANTA.NET({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            backgroundColor: options.backgroundColor,
            points: options.points,
            maxDistance: options.maxDistance,
            spacing: options.spacing,
            showDots: options.showDots,
            showLines: options.showLines
        });
        
        this.effects.set(elementId, effect);
        console.log(`🌐 Climate network created for ${elementId}`);
    }
    
    createSatelliteDots(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const effect = VANTA.DOTS({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            color2: options.color2,
            backgroundColor: options.backgroundColor,
            size: options.size,
            spacing: options.spacing,
            showLines: options.showLines
        });
        
        this.effects.set(elementId, effect);
        console.log(`🛰️ Satellite dots created for ${elementId}`);
    }
    
    createDataWaves(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const effect = VANTA.WAVES({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            waveHeight: options.waveHeight,
            waveSpeed: options.waveSpeed,
            zoom: options.zoom
        });
        
        this.effects.set(elementId, effect);
        console.log(`🌊 Data waves created for ${elementId}`);
    }
    
    createProjectNetwork(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const effect = VANTA.NET({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            backgroundColor: options.backgroundColor,
            points: options.points,
            maxDistance: options.maxDistance,
            spacing: options.spacing,
            showDots: options.showDots,
            showLines: options.showLines
        });
        
        this.effects.set(elementId, effect);
        console.log(`🔗 Project network created for ${elementId}`);
    }
    
    create3DBoxDots(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Create a 3D box effect using DOTS with perspective
        const effect = VANTA.DOTS({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            color2: options.color2,
            backgroundColor: options.backgroundColor,
            size: options.size,
            spacing: options.spacing,
            showLines: options.showLines
        });
        
        // Add CSS transform for 3D box perspective
        element.style.transform = `perspective(${options.perspective}px) rotateX(15deg) rotateY(5deg)`;
        element.style.transformStyle = 'preserve-3d';
        
        this.effects.set(elementId, effect);
        console.log(`📦 3D Box dots created for ${elementId}`);
    }
    
    createGroundViewDots(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Create ground view effect using DOTS with top-down perspective
        const effect = VANTA.DOTS({
            el: element,
            mouseControls: options.mouseControls,
            touchControls: options.touchControls,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            color2: options.color2,
            backgroundColor: options.backgroundColor,
            size: options.size,
            spacing: options.spacing,
            showLines: options.showLines
        });
        
        // Add CSS transform for ground view perspective (looking down)
        if (options.groundPerspective) {
            element.style.transform = `perspective(1000px) rotateX(60deg) translateZ(-100px)`;
            element.style.transformStyle = 'preserve-3d';
        }
        
        this.effects.set(elementId, effect);
        console.log(`🌍 Ground view dots created for ${elementId}`);
    }
    
    // Custom effect: Climate Data Flow
    createClimateDataFlow(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Combine waves and dots for a unique climate data effect
        const wavesEffect = VANTA.WAVES({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: 0x00bfa6,
            waveHeight: 20,
            waveSpeed: 0.4,
            zoom: 0.75
        });
        
        // Add floating data points
        setTimeout(() => {
            const dotsEffect = VANTA.DOTS({
                el: element,
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                color: 0x00d4ff,
                color2: 0x2ecc71,
                backgroundColor: 0x000000,
                size: 0.8,
                spacing: 30,
                showLines: false
            });
            
            this.effects.set(`${elementId}-dots`, dotsEffect);
        }, 1000);
        
        this.effects.set(elementId, wavesEffect);
        console.log(`🌍 Climate data flow created for ${elementId}`);
    }
    
    // Custom effect: Satellite Monitoring Grid
    createSatelliteGrid(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const effect = VANTA.NET({
            el: element,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: 0x00bfa6,
            backgroundColor: 0x1a1a1a,
            points: 12,
            maxDistance: 40,
            spacing: 25,
            showDots: true,
            showLines: true
        });
        
        this.effects.set(elementId, effect);
        console.log(`🛰️ Satellite grid created for ${elementId}`);
    }
    
    destroyEffect(elementId) {
        const effect = this.effects.get(elementId);
        if (effect && effect.destroy) {
            effect.destroy();
            this.effects.delete(elementId);
            console.log(`🗑️ Climate effect destroyed for ${elementId}`);
        }
    }
    
    destroyAll() {
        this.effects.forEach((effect, elementId) => {
            this.destroyEffect(elementId);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Vanta.js to load
    setTimeout(() => {
        window.climateEffects = new ClimateEffects();
    }, 1500);
});

// Export for use by other scripts
window.ClimateEffects = ClimateEffects;
