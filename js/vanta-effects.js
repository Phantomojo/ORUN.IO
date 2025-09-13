/* ===== VANTA.JS EFFECTS FOR ORUN.IO ===== */

class VantaEffects {
    constructor() {
        this.effects = new Map();
        this.init();
    }
    
    init() {
        // Wait for Vanta.js to load
        if (typeof VANTA === 'undefined') {
            console.log('⏳ Waiting for Vanta.js to load...');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        console.log('✅ Vanta.js loaded, initializing effects...');
        this.initializeEffects();
    }
    
    initializeEffects() {
        // Slide 1: Hero - NET effect (neural network)
        this.createNetEffect('slide-1', {
            color: 0x00bfa6,
            backgroundColor: 0xffffff,
            points: 12,
            maxDistance: 25,
            spacing: 18,
            showDots: true,
            showLines: true
        });
        
        // Slide 2: Earth - DOTS effect (satellite data points)
        this.createDotsEffect('slide-2', {
            color: 0x00bfa6,
            backgroundColor: 0x1a1a1a,
            color2: 0x00d4ff,
            size: 1.5,
            spacing: 20,
            showLines: false
        });
        
        // Slide 3: Stats - WAVES effect (data flow)
        this.createWavesEffect('slide-3', {
            color: 0x00bfa6,
            waveHeight: 20,
            waveSpeed: 0.5,
            zoom: 0.75
        });
        
        // Slide 4: Projects - NET effect (project connections)
        this.createNetEffect('slide-4', {
            color: 0x00bfa6,
            backgroundColor: 0x1a1a1a,
            points: 15,
            maxDistance: 30,
            spacing: 20,
            showDots: true,
            showLines: true
        });
        
        // Slide 5: Technology - CLOUDS effect (cloud computing)
        this.createCloudsEffect('slide-5', {
            skyColor: 0x00bfa6,
            cloudColor: 0x00d4ff,
            cloudShadowColor: 0x2ecc71,
            speed: 0.5
        });
        
        // Slide 6: Impact - BIRDS effect (flying data)
        this.createBirdsEffect('slide-6', {
            backgroundColor: 0x1a1a1a,
            color1: 0x00bfa6,
            color2: 0x00d4ff,
            wingSpan: 20,
            speedLimit: 2,
            separation: 20,
            alignment: 5,
            cohesion: 5
        });
        
        // Slide 7: Partners - FOG effect (partnership network)
        this.createFogEffect('slide-7', {
            highlightColor: 0x00bfa6,
            midtoneColor: 0x00d4ff,
            lowlightColor: 0x2ecc71,
            baseColor: 0x1a1a1a,
            blurFactor: 0.6,
            speed: 0.5
        });
        
        // Slide 8: Team - CELLS effect (team collaboration)
        this.createCellsEffect('slide-8', {
            color1: 0x00bfa6,
            color2: 0x00d4ff,
            speed: 1.2,
            size: 1.5,
            spacing: 1.8
        });
        
        // Slide 9: Contact - RINGS effect (communication waves)
        this.createRingsEffect('slide-9', {
            backgroundColor: 0x1a1a1a,
            color: 0x00bfa6,
            backgroundAlpha: 0.5
        });
        
        // Slide 10: Footer - TRUNK effect (growth and roots)
        this.createTrunkEffect('slide-10', {
            backgroundColor: 0x1a1a1a,
            color: 0x00bfa6,
            color2: 0x2ecc71,
            speed: 0.5
        });
        
        // Slide 11: Final - STARS effect (future vision)
        this.createStarsEffect('slide-11', {
            color: 0x00bfa6,
            color2: 0x00d4ff,
            backgroundColor: 0x1a1a1a,
            size: 1.5,
            quantity: 200
        });
    }
    
    createNetEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.NET({
            el: element,
            mouseControls: true,
            touchControls: true,
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
        
        this.effects.set(slideId, effect);
        console.log(`✅ NET effect created for ${slideId}`);
    }
    
    createDotsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.DOTS({
            el: element,
            mouseControls: true,
            touchControls: true,
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
        
        this.effects.set(slideId, effect);
        console.log(`✅ DOTS effect created for ${slideId}`);
    }
    
    createWavesEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.WAVES({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            waveHeight: options.waveHeight,
            waveSpeed: options.waveSpeed,
            zoom: options.zoom
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ WAVES effect created for ${slideId}`);
    }
    
    createCloudsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.CLOUDS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            skyColor: options.skyColor,
            cloudColor: options.cloudColor,
            cloudShadowColor: options.cloudShadowColor,
            speed: options.speed
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ CLOUDS effect created for ${slideId}`);
    }
    
    createBirdsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.BIRDS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            backgroundColor: options.backgroundColor,
            color1: options.color1,
            color2: options.color2,
            wingSpan: options.wingSpan,
            speedLimit: options.speedLimit,
            separation: options.separation,
            alignment: options.alignment,
            cohesion: options.cohesion
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ BIRDS effect created for ${slideId}`);
    }
    
    createFogEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.FOG({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            highlightColor: options.highlightColor,
            midtoneColor: options.midtoneColor,
            lowlightColor: options.lowlightColor,
            baseColor: options.baseColor,
            blurFactor: options.blurFactor,
            speed: options.speed
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ FOG effect created for ${slideId}`);
    }
    
    createCellsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.CELLS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color1: options.color1,
            color2: options.color2,
            speed: options.speed,
            size: options.size,
            spacing: options.spacing
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ CELLS effect created for ${slideId}`);
    }
    
    createRingsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.RINGS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            backgroundColor: options.backgroundColor,
            color: options.color,
            backgroundAlpha: options.backgroundAlpha
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ RINGS effect created for ${slideId}`);
    }
    
    createTrunkEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.TRUNK({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            backgroundColor: options.backgroundColor,
            color: options.color,
            color2: options.color2,
            speed: options.speed
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ TRUNK effect created for ${slideId}`);
    }
    
    createStarsEffect(slideId, options) {
        const element = document.querySelector(`.slide:nth-child(${this.getSlideNumber(slideId)}) .vanta-container`);
        if (!element) return;
        
        const effect = VANTA.STARS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: options.color,
            color2: options.color2,
            backgroundColor: options.backgroundColor,
            size: options.size,
            quantity: options.quantity
        });
        
        this.effects.set(slideId, effect);
        console.log(`✅ STARS effect created for ${slideId}`);
    }
    
    getSlideNumber(slideId) {
        const slideMap = {
            'slide-1': 1, 'slide-2': 2, 'slide-3': 3, 'slide-4': 4, 'slide-5': 5,
            'slide-6': 6, 'slide-7': 7, 'slide-8': 8, 'slide-9': 9, 'slide-10': 10, 'slide-11': 11
        };
        return slideMap[slideId] || 1;
    }
    
    destroyEffect(slideId) {
        const effect = this.effects.get(slideId);
        if (effect && effect.destroy) {
            effect.destroy();
            this.effects.delete(slideId);
            console.log(`🗑️ Effect destroyed for ${slideId}`);
        }
    }
    
    destroyAll() {
        this.effects.forEach((effect, slideId) => {
            this.destroyEffect(slideId);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all scripts to load
    setTimeout(() => {
        window.vantaEffects = new VantaEffects();
    }, 1000);
});

// Export for use by other scripts
window.VantaEffects = VantaEffects;

