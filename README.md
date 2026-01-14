# Portfolio & Interactive Playground

A modern, high-performance developer portfolio built with **React**, **Tailwind CSS**, and **Vite**. This project showcases front-end engineering skills through a responsive design and features a dedicated **Interactive Playground** with complex algorithmic simulations.

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sleek, translucent UI elements with background blurring.
- **Dark/Light Mode**: Fully theme-aware components with smooth transitions.
- **Animations**: Powered by `framer-motion` for fluid page transitions and scroll reveals.
- **Responsive**: Mobile-first architecture ensuring perfect rendering on all devices.

### 🎮 Interactive Playground
A dedicated section for technical demonstrations and experiments:

1.  **Pathfinding Visualizer**
    - **Algorithms**: Visualize **A* (A-Star)** and **Dijkstra** finding the shortest path.
    - **Interactive Grid**: Draw walls, drag Start/End nodes, and watch the search process in real-time.
    - **Performance**: Optimized rendering for smooth animation.
    - **Mobile Support**: Touch gestures for drawing walls and panning the grid.

2.  **Flocking Simulation (Boids)**
    - **Emergent Behavior**: Simulates a flock of birds using Reynolds' 3 rules: _Separation_, _Alignment_, and _Cohesion_.
    - **Customizable Physics**: Real-time sliders to tweak force and speed parameters.
    - **Predator Interaction**: Boids react to mouse hover/touch events.

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── playground/     # Interactive simulation components
│   │   ├── FlockingSimulation.jsx
│   │   └── PathfindingVisualizer.jsx
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   └── ...
├── pages/             # Route pages (Home, Projects, Playground)
├── assets/            # Static assets (images, icons)
└── main.jsx           # Entry point
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
