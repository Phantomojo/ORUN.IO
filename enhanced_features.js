// ORUN.IO Enhanced Demo Features
// Advanced JavaScript components for cutting-edge climate tech demo

// 1. AI-Powered Climate Intelligence Panel
class ClimateIntelligencePanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.insights = [];
        this.init();
    }

    init() {
        this.createPanel();
        this.loadInsights();
        this.startRealTimeUpdates();
    }

    createPanel() {
        this.container.innerHTML = `
            <div class="ai-insights-panel">
                <div class="panel-header">
                    <h3>🤖 AI Climate Intelligence</h3>
                    <span class="status-indicator live">LIVE</span>
                </div>
                <div class="insights-container" id="insights-container">
                    <div class="loading-spinner">Analyzing satellite data...</div>
                </div>
                <div class="panel-footer">
                    <small>Powered by Sentinel-2 & Landsat 8 • Updated every 15 minutes</small>
                </div>
            </div>
        `;
    }

    loadInsights() {
        // Simulate AI-generated insights
        const sampleInsights = [
            {
                confidence: 94,
                type: 'warning',
                message: 'Drought risk increasing in Makueni County - recommend early intervention',
                location: 'Makueni County, Kenya',
                timestamp: new Date(),
                action: 'Deploy emergency water supplies'
            },
            {
                confidence: 87,
                type: 'success',
                message: 'Mangrove restoration showing accelerated growth - 23% above projections',
                location: 'Niger Delta, Nigeria',
                timestamp: new Date(),
                action: 'Expand restoration area'
            },
            {
                confidence: 91,
                type: 'info',
                message: 'Optimal planting conditions detected - soil moisture at 78%',
                location: 'Okavango Basin, Botswana',
                timestamp: new Date(),
                action: 'Notify farming communities'
            }
        ];

        this.insights = sampleInsights;
        this.renderInsights();
    }

    renderInsights() {
        const container = document.getElementById('insights-container');
        container.innerHTML = this.insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-header">
                    <span class="confidence">${insight.confidence}% Confidence</span>
                    <span class="location">${insight.location}</span>
                </div>
                <p class="insight-message">${insight.message}</p>
                <div class="insight-action">
                    <button class="action-btn">📋 ${insight.action}</button>
                    <span class="timestamp">${this.formatTime(insight.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.simulateNewInsight();
        }, 30000); // Update every 30 seconds for demo
    }

    simulateNewInsight() {
        const newInsights = [
            'Water levels rising in Lake Victoria - flood risk moderate',
            'Vegetation recovery detected in restored areas - NDVI +0.08',
            'Temperature anomaly detected - 2.3°C above seasonal average',
            'Carbon sequestration rate exceeding targets by 15%'
        ];

        const randomInsight = {
            confidence: Math.floor(Math.random() * 20) + 80,
            type: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)],
            message: newInsights[Math.floor(Math.random() * newInsights.length)],
            location: ['Makueni County, Kenya', 'Niger Delta, Nigeria', 'Okavango Basin, Botswana'][Math.floor(Math.random() * 3)],
            timestamp: new Date(),
            action: 'Review and respond'
        };

        this.insights.unshift(randomInsight);
        if (this.insights.length > 5) this.insights.pop();
        this.renderInsights();
    }
}

// 2. Real-Time Impact Calculator
class ImpactCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        this.createCalculator();
        this.bindEvents();
    }

    createCalculator() {
        this.container.innerHTML = `
            <div class="impact-calculator">
                <h3>🧮 Real-Time Impact Calculator</h3>
                <div class="calculator-inputs">
                    <div class="input-group">
                        <label>Project Budget (USD)</label>
                        <input type="number" id="budget" value="250000" min="10000" max="10000000">
                    </div>
                    <div class="input-group">
                        <label>Duration (months)</label>
                        <input type="number" id="duration" value="24" min="6" max="120">
                    </div>
                    <div class="input-group">
                        <label>Beneficiaries</label>
                        <input type="number" id="beneficiaries" value="5000" min="100" max="100000">
                    </div>
                    <div class="input-group">
                        <label>Project Type</label>
                        <select id="projectType">
                            <option value="sand_dams">Sand Dams</option>
                            <option value="mangrove">Mangrove Restoration</option>
                            <option value="solar">Solar Energy</option>
                            <option value="water_mgmt">Water Management</option>
                        </select>
                    </div>
                </div>
                <div class="calculator-outputs">
                    <div class="output-card">
                        <h4>Expected NDVI Increase</h4>
                        <span class="output-value" id="ndviOutput">+0.12</span>
                    </div>
                    <div class="output-card">
                        <h4>Carbon Sequestration</h4>
                        <span class="output-value" id="carbonOutput">1,850 tCO2e</span>
                    </div>
                    <div class="output-card">
                        <h4>Economic ROI</h4>
                        <span class="output-value" id="roiOutput">3.2x</span>
                    </div>
                    <div class="output-card">
                        <h4>Resilience Score</h4>
                        <span class="output-value" id="resilienceOutput">78.5</span>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const inputs = ['budget', 'duration', 'beneficiaries', 'projectType'];
        inputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => {
                this.calculateImpact();
            });
        });
    }

    calculateImpact() {
        const budget = parseInt(document.getElementById('budget').value);
        const duration = parseInt(document.getElementById('duration').value);
        const beneficiaries = parseInt(document.getElementById('beneficiaries').value);
        const projectType = document.getElementById('projectType').value;

        // Simplified impact calculation algorithms
        const typeMultipliers = {
            sand_dams: { ndvi: 0.15, carbon: 0.8, roi: 3.5, resilience: 85 },
            mangrove: { ndvi: 0.20, carbon: 1.2, roi: 2.8, resilience: 90 },
            solar: { ndvi: 0.05, carbon: 2.5, roi: 4.2, resilience: 75 },
            water_mgmt: { ndvi: 0.12, carbon: 0.6, roi: 3.0, resilience: 80 }
        };

        const multiplier = typeMultipliers[projectType];
        const budgetFactor = Math.log10(budget / 100000);
        const durationFactor = Math.sqrt(duration / 12);
        const beneficiaryFactor = Math.log10(beneficiaries / 1000);

        const ndvi = (multiplier.ndvi * budgetFactor * durationFactor).toFixed(2);
        const carbon = Math.round(budget * multiplier.carbon * durationFactor / 1000);
        const roi = (multiplier.roi * beneficiaryFactor).toFixed(1);
        const resilience = Math.round(multiplier.resilience * budgetFactor * 0.8);

        document.getElementById('ndviOutput').textContent = `+${ndvi}`;
        document.getElementById('carbonOutput').textContent = `${carbon.toLocaleString()} tCO2e`;
        document.getElementById('roiOutput').textContent = `${roi}x`;
        document.getElementById('resilienceOutput').textContent = resilience;
    }
}

// 3. Climate Alert System
class ClimateAlertSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.alerts = [];
        this.init();
    }

    init() {
        this.createAlertSystem();
        this.loadAlerts();
        this.startAlertMonitoring();
    }

    createAlertSystem() {
        this.container.innerHTML = `
            <div class="climate-alerts">
                <div class="alerts-header">
                    <h3>🚨 Climate Risk Alerts</h3>
                    <div class="alert-controls">
                        <button class="filter-btn active" data-type="all">All</button>
                        <button class="filter-btn" data-type="urgent">Urgent</button>
                        <button class="filter-btn" data-type="warning">Warning</button>
                        <button class="filter-btn" data-type="info">Info</button>
                    </div>
                </div>
                <div class="alerts-container" id="alerts-container">
                </div>
            </div>
        `;

        // Bind filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterAlerts(e.target.dataset.type);
            });
        });
    }

    loadAlerts() {
        this.alerts = [
            {
                type: 'urgent',
                icon: '🚨',
                title: 'Drought Alert: Makueni County',
                message: '72% probability of severe drought in next 30 days',
                location: 'Makueni County, Kenya',
                timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
                action: 'Deploy emergency water supplies',
                priority: 1
            },
            {
                type: 'warning',
                icon: '⚠️',
                title: 'Flood Risk: Niger Delta',
                message: 'Heavy rains forecasted September 15-20, flood risk elevated',
                location: 'Niger Delta, Nigeria',
                timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
                action: 'Prepare evacuation routes',
                priority: 2
            },
            {
                type: 'info',
                icon: 'ℹ️',
                title: 'Optimal Planting: Botswana',
                message: 'Soil moisture ideal for planting in next 14 days',
                location: 'Okavango Basin, Botswana',
                timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
                action: 'Notify farming communities',
                priority: 3
            }
        ];

        this.renderAlerts();
    }

    renderAlerts(filteredAlerts = null) {
        const alertsToShow = filteredAlerts || this.alerts;
        const container = document.getElementById('alerts-container');
        
        container.innerHTML = alertsToShow.map(alert => `
            <div class="alert ${alert.type}" data-type="${alert.type}">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                    <div class="alert-header">
                        <h4>${alert.title}</h4>
                        <span class="alert-time">${this.getTimeAgo(alert.timestamp)}</span>
                    </div>
                    <p class="alert-message">${alert.message}</p>
                    <div class="alert-footer">
                        <span class="alert-location">📍 ${alert.location}</span>
                        <button class="alert-action">🎯 ${alert.action}</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterAlerts(type) {
        if (type === 'all') {
            this.renderAlerts();
        } else {
            const filtered = this.alerts.filter(alert => alert.type === type);
            this.renderAlerts(filtered);
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else {
            return `${hours}h ago`;
        }
    }

    startAlertMonitoring() {
        setInterval(() => {
            this.simulateNewAlert();
        }, 45000); // New alert every 45 seconds for demo
    }

    simulateNewAlert() {
        const alertTemplates = [
            {
                type: 'warning',
                icon: '⚠️',
                title: 'Temperature Anomaly Detected',
                message: '3.2°C above seasonal average in monitoring area',
                location: 'Sahel Region, Mali',
                action: 'Monitor livestock health'
            },
            {
                type: 'info',
                icon: 'ℹ️',
                title: 'Vegetation Recovery Confirmed',
                message: 'NDVI increased by 0.08 in restoration zone',
                location: 'Tigray Region, Ethiopia',
                action: 'Document success story'
            },
            {
                type: 'urgent',
                icon: '🚨',
                title: 'Locust Swarm Detected',
                message: 'Satellite imagery shows potential locust breeding sites',
                location: 'Horn of Africa',
                action: 'Deploy monitoring teams'
            }
        ];

        const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
        const newAlert = {
            ...template,
            timestamp: new Date(),
            priority: template.type === 'urgent' ? 1 : template.type === 'warning' ? 2 : 3
        };

        this.alerts.unshift(newAlert);
        if (this.alerts.length > 10) this.alerts.pop();
        
        // Re-render if showing all alerts
        const activeFilter = document.querySelector('.filter-btn.active').dataset.type;
        if (activeFilter === 'all' || activeFilter === newAlert.type) {
            this.renderAlerts();
        }
    }
}

// 4. Satellite Time-lapse Viewer
class SatelliteTimelapse {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentFrame = 0;
        this.isPlaying = false;
        this.frames = [];
        this.init();
    }

    init() {
        this.createViewer();
        this.loadFrames();
        this.bindControls();
    }

    createViewer() {
        this.container.innerHTML = `
            <div class="satellite-timelapse">
                <div class="timelapse-header">
                    <h3>🛰️ Satellite Time-lapse: NDVI Changes</h3>
                    <div class="location-selector">
                        <select id="locationSelect">
                            <option value="makueni">Makueni County, Kenya</option>
                            <option value="niger">Niger Delta, Nigeria</option>
                            <option value="okavango">Okavango Basin, Botswana</option>
                        </select>
                    </div>
                </div>
                <div class="timelapse-viewer">
                    <canvas id="timelapseCanvas" width="600" height="400"></canvas>
                    <div class="frame-overlay">
                        <div class="frame-info">
                            <span id="frameDate">January 2024</span>
                            <span id="frameNDVI">NDVI: 0.15</span>
                        </div>
                    </div>
                </div>
                <div class="timelapse-controls">
                    <button id="playBtn">▶️ Play</button>
                    <button id="pauseBtn" style="display:none">⏸️ Pause</button>
                    <input type="range" id="timelineSlider" min="0" max="11" value="0">
                    <div class="timeline-labels">
                        <span>Jan 2024</span>
                        <span>Sep 2024</span>
                    </div>
                </div>
                <div class="ndvi-legend">
                    <span>NDVI Scale:</span>
                    <div class="legend-bar">
                        <span style="background: #8B4513">Bare Soil (0.0)</span>
                        <span style="background: #DAA520">Sparse Vegetation (0.2)</span>
                        <span style="background: #9ACD32">Moderate Vegetation (0.4)</span>
                        <span style="background: #228B22">Dense Vegetation (0.8)</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadFrames() {
        // Simulate monthly NDVI data for visualization
        this.frames = [
            { date: 'January 2024', ndvi: 0.15, color: '#8B4513' },
            { date: 'February 2024', ndvi: 0.18, color: '#A0522D' },
            { date: 'March 2024', ndvi: 0.22, color: '#DAA520' },
            { date: 'April 2024', ndvi: 0.28, color: '#BDB76B' },
            { date: 'May 2024', ndvi: 0.35, color: '#9ACD32' },
            { date: 'June 2024', ndvi: 0.42, color: '#7CFC00' },
            { date: 'July 2024', ndvi: 0.38, color: '#9ACD32' },
            { date: 'August 2024', ndvi: 0.41, color: '#7CFC00' },
            { date: 'September 2024', ndvi: 0.45, color: '#32CD32' }
        ];

        this.drawFrame(0);
    }

    drawFrame(frameIndex) {
        const canvas = document.getElementById('timelapseCanvas');
        const ctx = canvas.getContext('2d');
        const frame = this.frames[frameIndex];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw simulated satellite image with NDVI coloring
        ctx.fillStyle = frame.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some texture to simulate vegetation patterns
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 20 + 5;
            
            ctx.fillStyle = this.adjustColor(frame.color, Math.random() * 0.3 - 0.15);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Update frame info
        document.getElementById('frameDate').textContent = frame.date;
        document.getElementById('frameNDVI').textContent = `NDVI: ${frame.ndvi}`;
        document.getElementById('timelineSlider').value = frameIndex;
    }

    adjustColor(color, factor) {
        // Simple color adjustment for texture
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + factor * 255));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + factor * 255));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + factor * 255));
        
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }

    bindControls() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const slider = document.getElementById('timelineSlider');

        playBtn.addEventListener('click', () => this.play());
        pauseBtn.addEventListener('click', () => this.pause());
        slider.addEventListener('input', (e) => {
            this.currentFrame = parseInt(e.target.value);
            this.drawFrame(this.currentFrame);
        });
    }

    play() {
        this.isPlaying = true;
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';

        this.playInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.drawFrame(this.currentFrame);
            
            if (this.currentFrame === this.frames.length - 1) {
                setTimeout(() => this.pause(), 1000); // Pause at end
            }
        }, 800);
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
        }
    }
}

// 5. Carbon Credit Tracker
class CarbonCreditTracker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.credits = {
            generated: 15420,
            verified: 14890,
            traded: 12340,
            revenue: 185100,
            price: 15.50
        };
        this.init();
    }

    init() {
        this.createTracker();
        this.startRealTimeUpdates();
    }

    createTracker() {
        this.container.innerHTML = `
            <div class="carbon-credit-tracker">
                <div class="tracker-header">
                    <h3>💰 Carbon Credit Marketplace</h3>
                    <div class="market-status">
                        <span class="status-dot live"></span>
                        <span>Live Trading</span>
                    </div>
                </div>
                <div class="credit-stats">
                    <div class="stat-card">
                        <div class="stat-icon">🌱</div>
                        <div class="stat-content">
                            <h4>Credits Generated</h4>
                            <span class="stat-value" id="creditsGenerated">${this.credits.generated.toLocaleString()}</span>
                            <span class="stat-unit">tCO2e</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <h4>Verified Credits</h4>
                            <span class="stat-value" id="creditsVerified">${this.credits.verified.toLocaleString()}</span>
                            <span class="stat-unit">tCO2e</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💱</div>
                        <div class="stat-content">
                            <h4>Credits Traded</h4>
                            <span class="stat-value" id="creditsTraded">${this.credits.traded.toLocaleString()}</span>
                            <span class="stat-unit">tCO2e</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💵</div>
                        <div class="stat-content">
                            <h4>Total Revenue</h4>
                            <span class="stat-value" id="totalRevenue">$${this.credits.revenue.toLocaleString()}</span>
                            <span class="stat-unit">USD</span>
                        </div>
                    </div>
                </div>
                <div class="price-ticker">
                    <div class="current-price">
                        <span>Current Price: </span>
                        <span class="price-value" id="currentPrice">$${this.credits.price}</span>
                        <span class="price-change positive" id="priceChange">+2.3%</span>
                    </div>
                    <div class="next-generation">
                        <span>Next Credit Generation: </span>
                        <span class="countdown" id="countdown">2h 34m</span>
                    </div>
                </div>
            </div>
        `;
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateCredits();
        }, 10000); // Update every 10 seconds

        setInterval(() => {
            this.updatePrice();
        }, 5000); // Update price every 5 seconds
    }

    updateCredits() {
        // Simulate credit generation
        this.credits.generated += Math.floor(Math.random() * 5) + 1;
        this.credits.verified += Math.floor(Math.random() * 3) + 1;
        this.credits.traded += Math.floor(Math.random() * 2) + 1;
        this.credits.revenue = this.credits.traded * this.credits.price;

        document.getElementById('creditsGenerated').textContent = this.credits.generated.toLocaleString();
        document.getElementById('creditsVerified').textContent = this.credits.verified.toLocaleString();
        document.getElementById('creditsTraded').textContent = this.credits.traded.toLocaleString();
        document.getElementById('totalRevenue').textContent = `$${Math.floor(this.credits.revenue).toLocaleString()}`;
    }

    updatePrice() {
        // Simulate price fluctuation
        const change = (Math.random() - 0.5) * 0.5; // ±$0.25
        this.credits.price = Math.max(10, this.credits.price + change);
        
        const changePercent = ((change / this.credits.price) * 100).toFixed(1);
        
        document.getElementById('currentPrice').textContent = `$${this.credits.price.toFixed(2)}`;
        
        const changeElement = document.getElementById('priceChange');
        changeElement.textContent = `${change >= 0 ? '+' : ''}${changePercent}%`;
        changeElement.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
}

// Initialize all enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if containers exist before initializing
    if (document.getElementById('ai-insights')) {
        new ClimateIntelligencePanel('ai-insights');
    }
    
    if (document.getElementById('impact-calculator')) {
        new ImpactCalculator('impact-calculator');
    }
    
    if (document.getElementById('climate-alerts')) {
        new ClimateAlertSystem('climate-alerts');
    }
    
    if (document.getElementById('satellite-timelapse')) {
        new SatelliteTimelapse('satellite-timelapse');
    }
    
    if (document.getElementById('carbon-tracker')) {
        new CarbonCreditTracker('carbon-tracker');
    }
});

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ClimateIntelligencePanel,
        ImpactCalculator,
        ClimateAlertSystem,
        SatelliteTimelapse,
        CarbonCreditTracker
    };
}

