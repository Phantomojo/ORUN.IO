/* ===== STATS ANIMATION COMPONENT ===== */

function initStatsAnimation() {
    console.log('Initializing enhanced stats animation...');
    
    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.3 });
    
    // Observe all stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

function animateStat(statElement) {
    const target = parseFloat(statElement.getAttribute('data-target'));
    const duration = 2500; // 2.5 seconds
    const start = performance.now();
    
    function updateStat(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = target * easeOutQuart;
        
        // Format the number based on the stat type
        const statType = statElement.closest('.stat-card').getAttribute('data-stat');
        
        switch(statType) {
            case 'projects':
                statElement.textContent = Math.floor(current).toString();
                break;
            case 'people':
                statElement.textContent = Math.floor(current).toLocaleString() + '+';
                break;
            case 'investment':
                statElement.textContent = '$' + current.toFixed(1) + 'M';
                break;
            case 'resilience':
                statElement.textContent = Math.floor(current) + '%';
                break;
            default:
                statElement.textContent = Math.floor(current).toString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateStat);
        } else {
            // Add a subtle pulse effect when animation completes
            statElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                statElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    requestAnimationFrame(updateStat);
}

// Initialize floating elements animation
function initFloatingElements() {
    // Create floating coordinate text
    const floatingTexts = [
        "37.5°E, -2.0°N", "37.8°E, -1.7°N", "6.4°E, 5.5°N", 
        "24.0°E, -20.0°S", "35.0°E, -1.0°S", "2.0°E, 6.0°N",
        "Climate Data", "Satellite Feed", "AI Analysis",
        "Blockchain Hash", "Community Input", "Impact Verified"
    ];
    
    floatingTexts.forEach((text, index) => {
        setTimeout(() => {
            createFloatingText(text, index);
        }, index * 2000);
    });
}

function createFloatingText(text, index) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    
    // Add different classes for different types
    if (text.includes('°')) {
        floatingText.classList.add('coordinate');
    } else if (text.includes('Data') || text.includes('Feed') || text.includes('Analysis')) {
        floatingText.classList.add('tech');
    } else {
        floatingText.classList.add('project');
    }
    
    // Random position
    floatingText.style.left = Math.random() * 100 + '%';
    floatingText.style.animationDelay = Math.random() * 5 + 's';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 25000);
}

// Enhanced icon animations with anime.js
function initIconAnimations() {
    console.log('Initializing custom icon animations...');
    
    // Animate icons when they come into view
    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateIcon(entry.target);
                iconObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all stat icons
    document.querySelectorAll('.stat-icon').forEach(icon => {
        iconObserver.observe(icon);
    });
}

function animateIcon(iconElement) {
    const iconChild = iconElement.querySelector('[class*="icon-"]');
    if (!iconChild) {
        console.warn('No icon child found in element:', iconElement);
        return;
    }
    const iconType = iconChild.className;
    
    switch(iconType) {
        case 'icon-projects':
            animateProjectsIcon(iconElement);
            break;
        case 'icon-people':
            animatePeopleIcon(iconElement);
            break;
        case 'icon-investment':
            animateInvestmentIcon(iconElement);
            break;
        case 'icon-resilience':
            animateResilienceIcon(iconElement);
            break;
    }
}

function animateProjectsIcon(iconElement) {
    const dots = iconElement.querySelectorAll('.project-dot');
    const lines = iconElement.querySelectorAll('.project-line');
    
    // Animate dots with staggered entrance
    anime({
        targets: dots,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutElastic(1, .8)'
    });
    
    // Animate lines with flow effect
    anime({
        targets: lines,
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(300, {start: 400}),
        easing: 'easeOutQuart'
    });
}

function animatePeopleIcon(iconElement) {
    const circles = iconElement.querySelectorAll('.person-circle');
    const connections = iconElement.querySelectorAll('.connection-line');
    
    // Animate person circles
    anime({
        targets: circles,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(300),
        easing: 'easeOutBack(1.7)'
    });
    
    // Animate connection lines
    anime({
        targets: connections,
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200, {start: 600}),
        easing: 'easeOutQuart'
    });
}

function animateInvestmentIcon(iconElement) {
    const dollar = iconElement.querySelector('.dollar-sign');
    const waves = iconElement.querySelectorAll('.investment-wave');
    
    // Animate dollar sign with rotation
    anime({
        targets: dollar,
        scale: [0, 1],
        rotate: [0, 360],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)'
    });
    
    // Animate waves with flow effect
    anime({
        targets: waves,
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200, {start: 500}),
        easing: 'easeOutQuart'
    });
}

function animateResilienceIcon(iconElement) {
    const bars = iconElement.querySelectorAll('.resilience-bar');
    
    // Animate bars with growing effect
    anime({
        targets: bars,
        scaleY: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(150),
        easing: 'easeOutElastic(1, .6)'
    });
}

// Add hover effects for stat cards
function addStatCardEffects() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Enhance icon animations on hover
            const icon = card.querySelector('.stat-icon');
            anime({
                targets: icon,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.stat-icon');
            anime({
                targets: icon,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
}

// Interactive card functionality
function initInteractiveCards() {
    console.log('Initializing interactive cards...');
    
    // Add click handlers to stat cards
    document.querySelectorAll('.stat-card[data-target-slide]').forEach(card => {
        card.addEventListener('click', function() {
            const targetSlide = parseInt(this.getAttribute('data-target-slide'));
            console.log(`Navigating to slide ${targetSlide}`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigate to target slide
            if (typeof goToSlide === 'function') {
                goToSlide(targetSlide);
            } else {
                console.log('goToSlide function not available');
            }
        });
    });
    
    // Add click handlers to country items
    document.querySelectorAll('.country-item').forEach(item => {
        item.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            console.log(`Clicked on ${country}`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigate to projects slide for country details
            if (typeof goToSlide === 'function') {
                goToSlide(4); // Projects slide
            }
        });
    });
}

// Enhanced hover effects
function addEnhancedHoverEffects() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'card-ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 191, 166, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: 50%;
                top: 50%;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Add ripple animation CSS
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add real-time data updates
function initRealTimeData() {
    // Simulate real-time data updates
    setInterval(() => {
        updateStatNumbers();
        updateClimateData();
        updateProjectStatus();
    }, 30000); // Update every 30 seconds
}

function updateStatNumbers() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const statType = card.getAttribute('data-stat');
        const numberElement = card.querySelector('.stat-number');
        const trendElement = card.querySelector('.trend-value');
        
        if (numberElement && trendElement) {
            // Add subtle animation to indicate update
            numberElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                numberElement.style.transform = 'scale(1)';
            }, 200);
            
            // Update trend indicator
            const currentTrend = trendElement.textContent;
            const newTrend = generateNewTrend(currentTrend);
            trendElement.textContent = newTrend;
        }
    });
}

function generateNewTrend(currentTrend) {
    const trends = ['+2', '+5', '+1', '+3', '+4', '+2', '+6'];
    return trends[Math.floor(Math.random() * trends.length)];
}

function updateClimateData() {
    const climateStats = document.querySelectorAll('.stat-item');
    climateStats.forEach(stat => {
        const valueElement = stat.querySelector('.stat-value');
        if (valueElement) {
            // Add pulse animation
            stat.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                stat.style.animation = '';
            }, 500);
        }
    });
}

function updateProjectStatus() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Add subtle glow effect to indicate activity
        card.style.boxShadow = '0 8px 32px rgba(0, 191, 166, 0.4)';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 1000);
    });
}

// Add data visualization charts
function initDataVisualizations() {
    // Create mini charts for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'mini-chart';
        chartContainer.style.cssText = `
            width: 100%;
            height: 40px;
            margin-top: 10px;
            background: rgba(0, 191, 166, 0.1);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
        `;
        
        // Create simple bar chart
        const chartData = generateChartData();
        chartData.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: ${index * (100 / chartData.length)}%;
                width: ${100 / chartData.length - 2}%;
                height: ${value}%;
                background: linear-gradient(to top, #00BFA6, #00D4B8);
                border-radius: 1px;
                animation: barGrow 1s ease ${index * 0.1}s both;
            `;
            chartContainer.appendChild(bar);
        });
        
        card.appendChild(chartContainer);
    });
}

function generateChartData() {
    const data = [];
    for (let i = 0; i < 8; i++) {
        data.push(Math.random() * 80 + 20);
    }
    return data;
}

// Add interactive tooltips
function initInteractiveTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', updateTooltipPosition);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'interactive-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 10000;
        pointer-events: none;
        max-width: 200px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 191, 166, 0.3);
    `;
    
    document.body.appendChild(tooltip);
    updateTooltipPosition(event);
    
    element.tooltip = tooltip;
}

function hideTooltip(event) {
    const element = event.target;
    if (element.tooltip) {
        element.tooltip.remove();
        element.tooltip = null;
    }
}

function updateTooltipPosition(event) {
    const element = event.target;
    if (element.tooltip) {
        const tooltip = element.tooltip;
        const rect = element.getBoundingClientRect();
        
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    }
}

// Add progress indicators
function initProgressIndicators() {
    const progressElements = document.querySelectorAll('.progress-indicator');
    
    progressElements.forEach(element => {
        const progress = element.getAttribute('data-progress') || 0;
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: rgba(0, 191, 166, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 8px;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #00BFA6, #00D4B8);
            border-radius: 2px;
            transition: width 1s ease;
        `;
        
        progressBar.appendChild(progressFill);
        element.appendChild(progressBar);
        
        // Animate progress
        setTimeout(() => {
            progressFill.style.width = progress + '%';
        }, 500);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initStatsAnimation();
    initIconAnimations();
    addStatCardEffects();
    initInteractiveCards();
    addEnhancedHoverEffects();
    addRippleAnimation();
    initRealTimeData();
    initDataVisualizations();
    initInteractiveTooltips();
    initProgressIndicators();
});
