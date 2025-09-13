// Interactive Slide 6 - Enhanced Solution Section
class InteractiveSlide6 {
    constructor() {
        this.isDetailsOpen = false;
        this.expandedItems = new Set();
        this.init();
    }

    init() {
        this.setupDetailsToggle();
        this.setupCollapsibleItems();
        this.setupFlowInteractions();
        this.setupBenefitCards();
        this.setupAnimations();
    }

    setupDetailsToggle() {
        const toggleBtn = document.getElementById('detailsToggle');
        const detailsContent = document.getElementById('detailsContent');

        if (toggleBtn && detailsContent) {
            toggleBtn.addEventListener('click', () => {
                this.isDetailsOpen = !this.isDetailsOpen;
                
                if (this.isDetailsOpen) {
                    detailsContent.classList.add('active');
                    toggleBtn.classList.add('active');
                    toggleBtn.querySelector('.toggle-text').textContent = 'Hide Technology Details';
                } else {
                    detailsContent.classList.remove('active');
                    toggleBtn.classList.remove('active');
                    toggleBtn.querySelector('.toggle-text').textContent = 'Explore Technology Details';
                    
                    // Close all expanded items
                    this.expandedItems.clear();
                    document.querySelectorAll('.item-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    document.querySelectorAll('.expand-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                }
            });
        }
    }

    setupCollapsibleItems() {
        const collapsibleItems = document.querySelectorAll('.collapsible-item');
        
        collapsibleItems.forEach(item => {
            const header = item.querySelector('.item-header');
            const content = item.querySelector('.item-content');
            const expandBtn = item.querySelector('.expand-btn');
            
            if (header && content && expandBtn) {
                header.addEventListener('click', () => {
                    const isExpanded = content.classList.contains('active');
                    
                    if (isExpanded) {
                        content.classList.remove('active');
                        expandBtn.classList.remove('active');
                        this.expandedItems.delete(item.dataset.tech);
                    } else {
                        content.classList.add('active');
                        expandBtn.classList.add('active');
                        this.expandedItems.add(item.dataset.tech);
                    }
                });
            }
        });
    }

    setupFlowInteractions() {
        const flowSteps = document.querySelectorAll('.flow-step');
        
        flowSteps.forEach((step, index) => {
            step.addEventListener('mouseenter', () => {
                // Add glow effect to current step
                step.style.boxShadow = '0 20px 40px rgba(0, 191, 166, 0.3)';
                
                // Animate pulse effect
                const pulse = step.querySelector('.step-pulse');
                if (pulse) {
                    pulse.style.animation = 'pulse 1s infinite';
                }
            });
            
            step.addEventListener('mouseleave', () => {
                step.style.boxShadow = '';
                const pulse = step.querySelector('.step-pulse');
                if (pulse) {
                    pulse.style.animation = 'pulse 2s infinite';
                }
            });
            
            step.addEventListener('click', () => {
                // Show detailed information for this step
                this.showStepDetails(step.dataset.step);
            });
        });
    }

    setupBenefitCards() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        
        benefitCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add floating animation
                card.style.animation = 'float 2s ease-in-out infinite';
                
                // Show metric highlight
                const metric = card.querySelector('.benefit-metric');
                if (metric) {
                    metric.style.transform = 'scale(1.1)';
                    metric.style.boxShadow = '0 8px 20px rgba(0, 191, 166, 0.6)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.animation = '';
                const metric = card.querySelector('.benefit-metric');
                if (metric) {
                    metric.style.transform = 'scale(1)';
                    metric.style.boxShadow = '0 4px 12px rgba(0, 191, 166, 0.4)';
                }
            });
            
            card.addEventListener('click', () => {
                this.showBenefitDetails(card.dataset.benefit);
            });
        });
    }

    setupAnimations() {
        // Add floating animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(-10px) scale(1.02); }
                50% { transform: translateY(-15px) scale(1.02); }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    showStepDetails(stepNumber) {
        // Create modal or tooltip with detailed information
        const stepDetails = {
            '1': {
                title: 'Satellite Data Collection',
                details: [
                    'Real-time monitoring from 12+ satellite constellations',
                    '6-hour update frequency for fresh data',
                    '99.2% accuracy rate with advanced calibration',
                    '30m resolution imagery for detailed analysis',
                    'Multi-spectral data for comprehensive monitoring'
                ]
            },
            '2': {
                title: 'AI Analysis Engine',
                details: [
                    'BACI methodology for causal impact verification',
                    '95% validation accuracy with machine learning',
                    'Peer-reviewed algorithms for scientific rigor',
                    'Automated data processing and analysis',
                    'Real-time impact assessment and reporting'
                ]
            },
            '3': {
                title: 'Blockchain Verification',
                details: [
                    'Immutable, transparent impact records',
                    'Smart contracts for automated verification',
                    'Public verification of all claims',
                    'Automated funding based on verified results',
                    'Decentralized trust and transparency'
                ]
            }
        };

        this.showModal(stepDetails[stepNumber]);
    }

    showBenefitDetails(benefitType) {
        const benefitDetails = {
            'speed': {
                title: 'Instant Verification',
                description: 'Our AI-powered system delivers results in minutes instead of months, dramatically reducing verification time.',
                metrics: ['90% faster than traditional methods', 'Real-time processing', 'Automated workflows']
            },
            'cost': {
                title: '90% Cost Reduction',
                description: 'From $50K to $5K per project - making impact verification accessible to all organizations.',
                metrics: ['$45K average savings per project', 'No hidden fees', 'Transparent pricing']
            },
            'transparency': {
                title: 'Full Transparency',
                description: 'Every verification is publicly recorded on the blockchain for complete transparency and trust.',
                metrics: ['100% public verification', 'Immutable records', 'Real-time access']
            },
            'accessibility': {
                title: 'Accessible to All',
                description: 'Works for projects as small as $10K, democratizing access to professional impact verification.',
                metrics: ['No minimum project size', 'Scalable pricing', 'Global accessibility']
            }
        };

        this.showModal(benefitDetails[benefitType]);
    }

    showModal(data) {
        // Remove existing modal
        const existingModal = document.querySelector('.interactive-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'interactive-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <div class="modal-metrics">
                        ${data.metrics.map(metric => `<div class="metric-item">• ${metric}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .interactive-modal {
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
                max-width: 500px;
                width: 100%;
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
            
            .modal-metrics {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .metric-item {
                color: rgba(255, 255, 255, 0.9);
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            
            .metric-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(5px);
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on slide 6
    const slide6 = document.querySelector('.solution-section');
    if (slide6) {
        new InteractiveSlide6();
    }
});

// Re-initialize when slide changes
document.addEventListener('slideChanged', (e) => {
    if (e.detail.slide === 6) {
        setTimeout(() => {
            new InteractiveSlide6();
        }, 100);
    }
});

