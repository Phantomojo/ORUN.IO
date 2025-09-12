const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cesium_earth.html'));
});

app.get('/cesium', (req, res) => {
    res.sendFile(path.join(__dirname, 'cesium_earth.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, 'mobile_earth.html'));
});

app.get('/insane', (req, res) => {
    res.sendFile(path.join(__dirname, 'insane_demo.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('=' * 80);
    console.log('🌍 ORUN.IO CESIUMJS EARTH SERVER 🌍');
    console.log('=' * 80);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🌍 CesiumJS Earth: http://localhost:${PORT}/cesium`);
    console.log(`📱 Mobile version: http://localhost:${PORT}/mobile`);
    console.log(`🎨 Awwwards version: http://localhost:${PORT}/insane`);
    console.log('=' * 80);
    console.log('Press Ctrl+C to stop the server...');
});
