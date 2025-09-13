/* ===== NEURAL NETWORK BACKGROUND GENERATOR ===== */

class NeuralNetworkBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            nodeCount: options.nodeCount || 25,
            connectionChance: options.connectionChance || 0.3,
            animationSpeed: options.animationSpeed || 4000,
            nodeSize: options.nodeSize || 4,
            connectionWidth: options.connectionWidth || 1,
            ...options
        };
        
        this.nodes = [];
        this.connections = [];
        this.init();
    }
    
    init() {
        this.createNodes();
        this.createConnections();
        this.startAnimations();
    }
    
    createNodes() {
        // Clear existing nodes
        this.container.innerHTML = '';
        
        for (let i = 0; i < this.options.nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            node.style.animationDelay = `${Math.random() * 3}s`;
            
            this.container.appendChild(node);
            this.nodes.push({ element: node, x, y });
        }
    }
    
    createConnections() {
        // Create connections between nearby nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                
                // Calculate distance
                const distance = Math.sqrt(
                    Math.pow(node1.x - node2.x, 2) + 
                    Math.pow(node1.y - node2.y, 2)
                );
                
                // Only connect nearby nodes
                if (distance < 30 && Math.random() < this.options.connectionChance) {
                    this.createConnection(node1, node2);
                }
            }
        }
    }
    
    createConnection(node1, node2) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        
        // Calculate connection properties
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Set connection properties
        connection.style.left = `${node1.x}%`;
        connection.style.top = `${node1.y}%`;
        connection.style.width = `${length}%`;
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.animationDelay = `${Math.random() * 4}s`;
        
        this.container.appendChild(connection);
        this.connections.push(connection);
    }
    
    startAnimations() {
        // Animate nodes
        this.nodes.forEach((node, index) => {
            const delay = index * 200;
            setTimeout(() => {
                node.element.style.animation = `pulseNode 3s ease-in-out infinite`;
            }, delay);
        });
        
        // Animate connections
        this.connections.forEach((connection, index) => {
            const delay = index * 300;
            setTimeout(() => {
                connection.style.animation = `flowConnection 4s ease-in-out infinite`;
            }, delay);
        });
    }
    
    update() {
        // Randomly update some connections
        if (Math.random() < 0.1) {
            this.connections.forEach(connection => {
                if (Math.random() < 0.3) {
                    connection.style.animation = 'none';
                    setTimeout(() => {
                        connection.style.animation = `flowConnection 4s ease-in-out infinite`;
                    }, 100);
                }
            });
        }
    }
    
    destroy() {
        this.container.innerHTML = '';
        this.nodes = [];
        this.connections = [];
    }
}

// Initialize neural networks for all slides
function initNeuralNetworks() {
    console.log('🧠 Initializing neural networks...');
    
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        const container = slide.querySelector('.neural-network');
        if (container) {
            const slideNumber = index + 1;
            
            // Different configurations for different slides
            let options = {
                nodeCount: 20,
                connectionChance: 0.25,
                animationSpeed: 4000
            };
            
            if (slideNumber === 2) {
                // Earth slide - minimal interference
                options = {
                    nodeCount: 12,
                    connectionChance: 0.15,
                    animationSpeed: 6000
                };
            } else if (slideNumber % 2 === 0) {
                // Dark slides - more prominent
                options = {
                    nodeCount: 30,
                    connectionChance: 0.35,
                    animationSpeed: 3500
                };
            } else {
                // Light slides - subtle
                options = {
                    nodeCount: 20,
                    connectionChance: 0.25,
                    animationSpeed: 4000
                };
            }
            
            const neuralNet = new NeuralNetworkBackground(container, options);
            
            // Store reference for updates
            container.neuralNetwork = neuralNet;
            
            console.log(`✅ Neural network initialized for slide ${slideNumber}`);
        }
    });
}

// Update neural networks periodically
function updateNeuralNetworks() {
    const containers = document.querySelectorAll('.neural-network');
    containers.forEach(container => {
        if (container.neuralNetwork) {
            container.neuralNetwork.update();
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initNeuralNetworks, 1000);
    
    // Update networks every 10 seconds
    setInterval(updateNeuralNetworks, 10000);
});

// Export for use by other scripts
window.NeuralNetworkBackground = NeuralNetworkBackground;
window.initNeuralNetworks = initNeuralNetworks;

