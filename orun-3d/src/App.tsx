import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Add particles.js script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.onload = () => {
        if (window.particlesJS) {
          window.particlesJS('particles-js', {
            particles: {
              number: { value: 80 },
              color: { value: '#00d4ff' },
              shape: { type: 'circle' },
              opacity: { value: 0.5 },
              size: { value: 3 },
              line_linked: {
                enable: true,
                distance: 150,
                color: '#00d4ff',
                opacity: 0.4,
                width: 1
              },
              move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
              }
            },
            interactivity: {
              detect_on: 'canvas',
              events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
              }
            },
            retina_detect: true
          });
        }
      };
      document.head.appendChild(script);

      // Add floating text elements
      const createFloatingText = () => {
        const texts = [
          '37.5°E, -2.0°N', '6.4°E, 5.5°N', '24.0°E, -20.0°S',
          'Climate Resilience', 'AI Insights', 'Satellite Analytics',
          'Carbon Credits', 'Impact Verification', 'Community Data',
          'ORUN Family', 'Cosmos Network', 'Interconnected'
        ];

        texts.forEach((text, index) => {
          const element = document.createElement('div');
          element.className = 'floating-text';
          element.textContent = text;
          element.style.position = 'fixed';
          element.style.color = 'rgba(0, 212, 255, 0.9)';
          element.style.fontFamily = 'Orbitron, monospace';
          element.style.fontSize = '0.9rem';
          element.style.fontWeight = '600';
          element.style.textShadow = '0 0 10px rgba(0, 212, 255, 0.8)';
          element.style.pointerEvents = 'none';
          element.style.zIndex = '10';
          element.style.left = Math.random() * 100 + '%';
          element.style.animation = `float 20s infinite linear`;
          element.style.animationDelay = Math.random() * 20 + 's';
          element.style.animationDuration = (15 + Math.random() * 10) + 's';
          document.body.appendChild(element);

          setTimeout(() => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }, 25000);
        });
      };

      // Add CSS for floating animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      // Initialize floating text
      setTimeout(() => {
        setInterval(createFloatingText, 3000);
      }, 2000);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">ORUN.IO</div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <div id="particles-js"></div>
        <div className="hero-content">
          <h1 className="hero-title">ORUN.IO</h1>
          <p className="hero-subtitle">Revolutionary Climate Impact Verification Platform for Africa</p>
          <div className="hero-cta">
            <a href="#earth" className="btn btn-primary">Explore Projects</a>
            <a href="#stats" className="btn btn-secondary">View Technology</a>
          </div>
        </div>
      </section>

      {/* 3D Earth Section */}
      <section className="earth-section" id="earth">
        <div className="earth-overlay">
          <h2 className="earth-title">Climate Impact</h2>
          <p className="earth-subtitle">Real-time satellite monitoring across Africa</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">3</span>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">16,000</span>
            <div className="stat-label">Beneficiaries</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">78.5%</span>
            <div className="stat-label">Resilience Score</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <div className="stat-label">Monitoring</div>
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="tech-section">
        <div className="tech-content">
          <h2 className="tech-title">Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Satellite Data</h3>
              <p>Real-time monitoring with Google Earth Engine</p>
            </div>
            <div className="tech-card">
              <h3>AI Analytics</h3>
              <p>Machine learning for impact verification</p>
            </div>
            <div className="tech-card">
              <h3>Community Reports</h3>
              <p>Crowdsourced data from local communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">ORUN.IO</div>
          <div className="footer-text">Revolutionary Climate Impact Verification Platform for Africa</div>
        </div>
      </footer>
    </div>
  );
}

export default App;