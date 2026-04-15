# VoxelPortfolio

An interactive 3D portfolio experience built with Three.js, featuring a first-person voxel-based environment where users can explore and interact with projects.

## Features

- **3D Interactive Environment**: Navigate through a custom 3D scene with physics-based movement
- **First-Person Perspective**: Immersive gameplay-like controls with gravity and collision detection
- **Project Showcase**: Click on voxels to reveal and learn about projects through interactive modals
- **Smooth Animations**: Powered by GSAP for silky-smooth transitions and effects
- **WebGL Rendering**: High-performance 3D graphics with advanced lighting and post-processing
- **Responsive Design**: Adapts to all screen sizes
- **GitHub Actions Deployment**: Automatically deploys to GitHub Pages on push to main

## Technologies Used

- **Three.js**: 3D graphics and WebGL rendering
- **GSAP**: Animation library for smooth transitions
- **Vite**: Fast build tool and development server
- **HTML5 Canvas**: Rendering target
- **Vanilla JavaScript**: Core application logic

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VoxelPortfolio.git
cd VoxelPortfolio
```

2. Install dependencies:
```bash
npm install
```

## Development

To run the development server with hot module reloading:

```bash
npm run dev
```

This will start a local development server (typically at `http://localhost:5173`) where you can see your changes in real-time.

**Controls:**
- Use **WASD** keys or **arrow keys** to move around
- **Space** to jump
- **r** to respawn thr character in initial position.
- **Mouse** to look around
- **Click** on interactive objects to view project details
- **Exit** button to close project modals

## Build

To create an optimized production build:

```bash
npm run build
```

The built files will be output to the `dist` directory, ready for deployment.

## Preview

To preview the production build locally before deployment:

```bash
npm run preview
```

This will serve the contents of the `dist` directory at a local URL.

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

**Automatic Deployment:**
- Push to the `main` branch triggers the GitHub Actions workflow
- The workflow installs dependencies, builds the project, and deploys to GitHub Pages
- Your portfolio will be live at `https://yourusername.github.io/VoxelPortfolio/`

**Manual Deployment:**
1. Build the project: `npm run build`
2. Manually upload the contents of the `dist` directory to your hosting service

## Project Structure

```
VoxelPortfolio/
├── index.html          # Main HTML entry point
├── main.js             # Application entry point with Three.js setup
├── style.css           # Styling
├── package.json        # Project dependencies and scripts
├── .github/
│   └── pages.yml       # GitHub Actions deployment configuration
├── public/             # Static assets
└── dist/               # Built output (generated)
```

## Customization

### Adding Projects
To add your projects to the portfolio:
1. Edit the project data in `main.js`
2. Create voxel placements for each project
3. Configure modal content with descriptions and links

### Styling
Modify `style.css` to customize colors, fonts, and layout of the modals and UI elements.

### 3D Models and Assets
Place 3D models (GLTF/GLB format) in the `public` directory and load them using the GLTFLoader in `main.js`.

## Physics System

The project includes a physics-based movement system:
- **Gravity**: Affects character downward movement
- **Collision Detection**: Octree-based collision system for accurate physics simulation
- **Capsule Collider**: Player collision volume for realistic interactions
- **Jump Mechanic**: Press space to jump with realistic gravity

## Browser Support

VoxelPortfolio works best in modern browsers that support:
- WebGL 2.0
- ES6 JavaScript
- Canvas API

Tested on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- Use hardware acceleration in your browser settings for better performance
- Close unnecessary browser tabs
- For best experience, use a dedicated graphics card
- The application automatically handles responsive scaling

## Contributing

Contributions are welcome! Feel free to fork the project and submit pull requests.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Three.js community for the powerful 3D graphics library
- GSAP for smooth animations
- Vite for the fast build tool
