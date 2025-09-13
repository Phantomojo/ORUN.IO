// Satellite Animations and Interactions for Slide 7
class SatelliteAnimations {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.satellites = [];
        this.animationId = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createSatellites();
        this.setupInteractions();
        this.setupIntersectionObserver();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.getElementById('satellite-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    createSatellites() {
        this.satellites = [
            {
                x: 0.2,
                y: 0.3,
                radius: 5,
                speed: 0.002,
                angle: 0,
                color: '#1a1a1a',
                pulse: 0,
                orbitRadius: 80,
                name: 'Landsat 8/9',
                type: 'landsat'
            },
            {
                x: 0.7,
                y: 0.6,
                radius: 4.5,
                speed: 0.003,
                angle: Math.PI / 3,
                color: '#2d2d2d',
                pulse: 0,
                orbitRadius: 60,
                name: 'Sentinel-2',
                type: 'sentinel'
            },
            {
                x: 0.5,
                y: 0.8,
                radius: 4,
                speed: 0.004,
                angle: Math.PI,
                color: '#1a1a1a',
                pulse: 0,
                orbitRadius: 40,
                name: 'MODIS',
                type: 'modis'
            },
            {
                x: 0.8,
                y: 0.2,
                radius: 4.8,
                speed: 0.0025,
                angle: Math.PI / 2,
                color: '#2d2d2d',
                pulse: 0,
                orbitRadius: 70,
                name: 'Galileo',
                type: 'galileo'
            }
        ];
    }

    setupInteractions() {
        // Satellite card interactions
        const satelliteCards = document.querySelectorAll('.interactive-satellite');
        satelliteCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.highlightSatellite(card.dataset.satellite);
            });
            
            card.addEventListener('mouseleave', () => {
                this.clearHighlights();
            });
            
            card.addEventListener('click', () => {
                this.showSatelliteDetails(card.dataset.satellite);
            });
        });

        // Performance stat interactions
        const performanceStats = document.querySelectorAll('.animated-stat');
        performanceStats.forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                this.animateStat(stat.dataset.stat);
            });
        });

        // Coverage section interaction
        const coverageSection = document.querySelector('.interactive-coverage');
        if (coverageSection) {
            coverageSection.addEventListener('click', () => {
                this.showCoverageDetails();
            });
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                    this.startAnimations();
                } else {
                    this.isVisible = false;
                    this.stopAnimations();
                }
            });
        }, { threshold: 0.3 });

        const slide7 = document.querySelector('.satellite-slide');
        if (slide7) {
            observer.observe(slide7);
        }
    }

    animate() {
        if (!this.isVisible || !this.ctx || !this.canvas) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.clearCanvas();
        this.updateSatellites();
        this.drawSatellites();
        this.drawOrbitLines();
        this.drawDataStreams();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateSatellites() {
        this.satellites.forEach(satellite => {
            satellite.angle += satellite.speed;
            satellite.pulse += 0.05;
            
            // Update position based on orbit
            const centerX = satellite.x * this.canvas.width;
            const centerY = satellite.y * this.canvas.height;
            
            satellite.currentX = centerX + Math.cos(satellite.angle) * satellite.orbitRadius;
            satellite.currentY = centerY + Math.sin(satellite.angle) * satellite.orbitRadius;
        });
    }

    drawSatellites() {
        this.satellites.forEach(satellite => {
            const pulseSize = satellite.radius + Math.sin(satellite.pulse) * 2;
            
            // Draw satellite glow with enhanced visibility for light background
            const gradient = this.ctx.createRadialGradient(
                satellite.currentX, satellite.currentY, 0,
                satellite.currentX, satellite.currentY, pulseSize * 15
            );
            gradient.addColorStop(0, satellite.color + 'CC');
            gradient.addColorStop(0.3, satellite.color + '80');
            gradient.addColorStop(0.7, satellite.color + '40');
            gradient.addColorStop(1, satellite.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(satellite.currentX, satellite.currentY, pulseSize * 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw satellite body with enhanced visibility
            this.ctx.fillStyle = satellite.color;
            this.ctx.beginPath();
            this.ctx.arc(satellite.currentX, satellite.currentY, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw satellite details with better contrast
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(satellite.currentX, satellite.currentY, pulseSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw satellite name label with dark background for visibility
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(satellite.name, satellite.currentX, satellite.currentY + pulseSize + 20);
        });
    }

    drawOrbitLines() {
        this.satellites.forEach(satellite => {
            const centerX = satellite.x * this.canvas.width;
            const centerY = satellite.y * this.canvas.height;
            
            this.ctx.strokeStyle = satellite.color + '80';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 10]);
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, satellite.orbitRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    drawDataStreams() {
        // Draw data streams between satellites and ground stations
        this.satellites.forEach((satellite, index) => {
            if (index % 2 === 0) {
                const groundX = satellite.x * this.canvas.width;
                const groundY = this.canvas.height - 50;
                
                this.ctx.strokeStyle = satellite.color + 'AA';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(satellite.currentX, satellite.currentY);
                this.ctx.lineTo(groundX, groundY);
                this.ctx.stroke();
                
                // Draw data packets with enhanced visibility
                const packetY = satellite.currentY + (groundY - satellite.currentY) * 0.7;
                this.ctx.fillStyle = satellite.color;
                this.ctx.beginPath();
                this.ctx.arc(groundX, packetY, 4, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw ground station
                this.ctx.fillStyle = satellite.color;
                this.ctx.beginPath();
                this.ctx.arc(groundX, groundY, 6, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    highlightSatellite(satelliteType) {
        // Add visual feedback for satellite highlighting
        const satelliteMap = {
            'landsat': 0,
            'sentinel': 1,
            'modis': 2,
            'galileo': 3
        };
        
        const index = satelliteMap[satelliteType];
        if (index !== undefined && this.satellites[index]) {
            this.satellites[index].highlighted = true;
        }
    }

    clearHighlights() {
        this.satellites.forEach(satellite => {
            satellite.highlighted = false;
        });
    }

    animateStat(statType) {
        // Add special animation for performance stats
        const statElement = document.querySelector(`[data-stat="${statType}"]`);
        if (statElement) {
            statElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                statElement.style.transform = '';
            }, 200);
        }
    }

    showSatelliteDetails(satelliteType) {
        const details = {
            'landsat': {
                title: 'Landsat 8/9 Satellite',
                description: 'NASA\'s Landsat satellites provide the longest continuous space-based record of Earth\'s land in existence.',
                specs: [
                    'Launched: 2013 (Landsat 8), 2021 (Landsat 9)',
                    'Orbit: 705 km altitude, sun-synchronous',
                    'Spectral bands: 11 bands from visible to thermal',
                    'Swath width: 185 km',
                    'Revisit time: 16 days'
                ],
                applications: [
                    'Vegetation monitoring',
                    'Land use change detection',
                    'Water resource management',
                    'Disaster assessment'
                ]
            },
            'sentinel': {
                title: 'Sentinel-2 Satellite',
                description: 'Part of the European Space Agency\'s Copernicus program, providing high-resolution optical imagery.',
                specs: [
                    'Launched: 2015 (Sentinel-2A), 2017 (Sentinel-2B)',
                    'Orbit: 786 km altitude, sun-synchronous',
                    'Spectral bands: 13 bands from visible to SWIR',
                    'Swath width: 290 km',
                    'Revisit time: 5 days (with both satellites)'
                ],
                applications: [
                    'High-resolution land monitoring',
                    'Agricultural monitoring',
                    'Forest management',
                    'Urban planning'
                ]
            },
            'modis': {
                title: 'MODIS Instrument',
                description: 'Moderate Resolution Imaging Spectroradiometer aboard NASA\'s Terra and Aqua satellites.',
                specs: [
                    'Launched: 1999 (Terra), 2002 (Aqua)',
                    'Orbit: 705 km altitude, sun-synchronous',
                    'Spectral bands: 36 bands from visible to thermal',
                    'Swath width: 2330 km',
                    'Revisit time: Daily (with both satellites)'
                ],
                applications: [
                    'Global climate monitoring',
                    'Atmospheric studies',
                    'Ocean color monitoring',
                    'Fire detection'
                ]
            },
            'galileo': {
                title: 'Galileo Satellite Constellation',
                description: 'European Union\'s global navigation satellite system, providing highly accurate positioning and timing services.',
                specs: [
                    'Launched: 2011-2021 (30 satellites)',
                    'Orbit: 23,222 km altitude, medium Earth orbit',
                    'Constellation: 30 satellites in 3 orbital planes',
                    'Coverage: Global, 24/7',
                    'Accuracy: Sub-meter positioning'
                ],
                applications: [
                    'Precision navigation',
                    'Timing services',
                    'Search and rescue',
                    'Autonomous vehicle guidance'
                ]
            }
        };

        this.showModal(details[satelliteType]);
    }

    showCoverageDetails() {
        const coverageDetails = {
            title: 'Complete African Coverage',
            description: 'Our satellite network provides comprehensive monitoring across all 54 African countries with real-time data collection and analysis.',
            features: [
                'Real-time data collection from 12+ satellite constellations',
                '1.2M+ data points collected daily across Africa',
                '24/7 monitoring with 6-hour update frequency',
                '99.2% accuracy rate in data collection',
                '90% cost reduction compared to traditional methods'
            ],
            countries: [
                'North Africa: Egypt, Libya, Tunisia, Algeria, Morocco',
                'West Africa: Nigeria, Ghana, Senegal, Mali, Ivory Coast',
                'East Africa: Kenya, Ethiopia, Tanzania, Uganda, Rwanda',
                'Central Africa: Democratic Republic of Congo, Cameroon, Chad',
                'Southern Africa: South Africa, Botswana, Namibia, Zambia'
            ]
        };

        this.showModal(coverageDetails);
    }

    showModal(data) {
        // Remove existing modal
        const existingModal = document.querySelector('.satellite-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'satellite-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    ${data.specs ? `
                        <div class="modal-section">
                            <h4>Technical Specifications</h4>
                            <ul>
                                ${data.specs.map(spec => `<li>${spec}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${data.applications ? `
                        <div class="modal-section">
                            <h4>Applications</h4>
                            <ul>
                                ${data.applications.map(app => `<li>${app}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${data.features ? `
                        <div class="modal-section">
                            <h4>Key Features</h4>
                            <ul>
                                ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${data.countries ? `
                        <div class="modal-section">
                            <h4>Coverage Areas</h4>
                            <ul>
                                ${data.countries.map(country => `<li>${country}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .satellite-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeInScale 0.3s ease;
            }
            
            .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .modal-content {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 2rem;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: slideInUp 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: #ffffff;
                font-size: 2rem;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #00BFA6;
            }
            
            .modal-content h3 {
                color: #ffffff;
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }
            
            .modal-content p {
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .modal-section {
                margin-bottom: 1.5rem;
            }
            
            .modal-section h4 {
                color: #00BFA6;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .modal-section ul {
                list-style: none;
                padding: 0;
            }
            
            .modal-section li {
                color: rgba(255, 255, 255, 0.9);
                padding: 0.3rem 0;
                padding-left: 1rem;
                position: relative;
            }
            
            .modal-section li::before {
                content: '•';
                color: #00BFA6;
                position: absolute;
                left: 0;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
            styleSheet.remove();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
                styleSheet.remove();
            }
        });

        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                styleSheet.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    startAnimations() {
        // Start any additional animations when slide becomes visible
        this.satellites.forEach(satellite => {
            satellite.speed *= 1.5; // Speed up animations
        });
    }

    stopAnimations() {
        // Slow down animations when slide is not visible
        this.satellites.forEach(satellite => {
            satellite.speed /= 1.5; // Slow down animations
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on slide 7
    const slide7 = document.querySelector('.satellite-slide');
    if (slide7) {
        new SatelliteAnimations();
    }
});

// Re-initialize when slide changes
document.addEventListener('slideChanged', (e) => {
    if (e.detail.slide === 7) {
        setTimeout(() => {
            new SatelliteAnimations();
        }, 100);
    }
});
