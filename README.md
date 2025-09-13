# ORUN.IO Frontend

This is the organized frontend structure for the ORUN.IO demo, split from the original monolithic HTML file.

## 📁 Directory Structure

```
frontend/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All CSS styles
├── js/
│   ├── main.js            # Core functionality (slides, navigation, etc.)
│   ├── particles.js       # Particles.js configuration
│   ├── earth3d.js         # 3D Earth component with Three.js
│   └── stats.js           # Stats animations and floating elements
├── libs/
│   └── dependencies.html  # External library CDN links
├── assets/
│   ├── images/            # Image assets (if any)
│   └── fonts/             # Custom fonts (if any)
└── README.md              # This file
```

## 🚀 External Dependencies

The project uses the following external libraries (loaded via CDN):

- **Anime.js** (3.2.1) - For smooth animations
- **Three.js** (r128) - For 3D graphics and WebGL
- **GSAP** (3.12.2) - For advanced animations
  - ScrollTrigger plugin
  - TextPlugin
- **Particles.js** (2.0.0) - For particle effects and network backgrounds
- **Chart.js** - For data visualization
- **Lottie Player** - For Lottie animations
- **Google Fonts** - Inter, Orbitron, Poppins, Montserrat

## 🎯 Features

- **Full-page slide navigation** with smooth transitions
- **3D Earth visualization** with Three.js
- **Particle background effects** with Particles.js
- **Animated statistics** with Anime.js
- **Responsive design** for all screen sizes
- **Keyboard navigation** (arrow keys, space, home, end)
- **Mouse wheel navigation** with sensitivity control
- **Custom cursor** effects
- **Loading screen** with progress bar

## 🎨 Design System

- **Color Palette**: Teal (#00bfa6), Blue (#0077cc), Orange (#ff5722)
- **Typography**: Orbitron (headings), Inter (body text)
- **Background Pattern**: Alternating white/black slides
- **Animations**: Smooth transitions with GSAP and Anime.js

## 🛠️ Development

To run the demo:

1. Serve the files from a web server (required for CORS)
2. Open `index.html` in a modern browser
3. Use arrow keys or mouse wheel to navigate between slides

## 📱 Responsive Design

The demo is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen orientations

## 🔧 Customization

Each component is modular and can be easily customized:

- **CSS**: Modify `css/styles.css` for styling changes
- **JavaScript**: Edit individual JS files for functionality
- **Content**: Update `index.html` for text and structure changes
- **Dependencies**: Modify `libs/dependencies.html` for library updates

## 📊 Performance

- Optimized for smooth 60fps animations
- Efficient memory management for 3D graphics
- Lazy loading of heavy components
- Responsive image handling

## 🌍 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Notes

- The original monolithic file was 3,883 lines
- This organized structure is much more maintainable
- Each component can be developed and tested independently
- External dependencies are clearly documented
- Easy to add new features or modify existing ones
