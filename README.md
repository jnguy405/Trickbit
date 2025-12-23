# [Live Demo](https://jnguy405.github.io/Trickbit/) | UC Santa Cruz CMPM 120 Final Project

# Trickbit

A precision 2D platformer built with **Phaser.js** and **Tiled** featuring progressive difficulty, intelligent enemy AI, and dynamic environmental interactions. Players navigate three distinct levels, overcoming parkour challenges, environmental hazards, and combat encounters with finite state machine-driven enemies.

---

## 🎯 Project Summary

*Trickbit* is a 3-level platformer that blends precise movement mechanics with environmental puzzle-solving. Built as a solo project, the game features a complete gameplay loop with player physics, enemy AI, particle effects, and audio integration.

The game progresses through three distinct stages: a tutorial level introducing core mechanics, a hazard-focused environment with falling platforms, and a final challenge requiring multi-key collection and enemy avoidance. The architecture emphasizes modular, reusable systems through a **BasePlatformerScene** class that handles shared functionality across all levels.

Developed with a focus on polished player experience, the project demonstrates professional game development workflows including physics tuning, animation states, particle systems, and responsive controls.

---

## 🔧 Tech Stack

### Core Engine
- **[Phaser.js](https://phaser.io/)** – Game engine with physics, animations, and scene management
- **[Tiled](https://www.mapeditor.org/)** – Level design and tilemap creation
- **JavaScript** – Game logic and systems implementation

### Game Systems
- **Arcade Physics** – Collision detection and player/enemy movement
- **Finite State Machines** – Enemy AI behaviors (Idle, Patrol, Chase, Attack)
- **Particle Systems** – Visual effects for movement, jumps, and interactions
- **Audio Management** – Sound effects for all player actions and events

### Tooling & Workflow
- **[VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** – Local development and testing
- **HTML5/CSS** – Browser deployment and UI presentation

---

## 🎮 Key Features
### ✅ Progressive Level Design
- **Level 1**: Tutorial introduction with guide blocks and single-key progression
- **Level 2**: Environmental challenges with falling platforms and hazards
- **Level 3**: Advanced difficulty with multi-key collection and enemy bypassing

### 🤖 Intelligent Enemy AI
- **Finite State Machine**: Four-state system (Idle, Patrol, Chase, Attack)
- **Pathfinding**: Patrol patterns with edge detection and world bounds
- **Dynamic Detection**: Player tracking with adjustable ranges
- **Physics Integration**: Gravity-affected movement with collision response

### ⚡ Player Mechanics
- **Precision Movement**: Acceleration/deceleration with ground/air differentiation
- **Jump Physics**: Variable height with boost power-ups
- **Interactions**: Chest opening, key collection, door unlocking
- **Health System**: Damage feedback with visual indicators

### 🌟 Visual & Audio Polish
- **Particle Effects**: Walking dust, jump trails, chest bursts
- **Camera Dynamics**: Zoom adjustments and follow offsets
- **Audio Integration**: Footstep sounds, jump effects, damage feedback, and environmental audio
- **UI Feedback**: Health displays, collectible counters, and interaction prompts

### 🏗️ Architecture
- **BasePlatformerScene**: Shared parent class for all game levels
- **Modular Systems**: Separated physics, particles, AI, and collision systems
- **Reusable Components**: Configurable enemy spawning and object creation

---

## 🚀 Development Highlights

### Solo Development Achievements
- **Complete Game Loop**: Three fully playable levels with progressive difficulty
- **Polished Physics**: Tuned movement with ground/air differentiation and coyote time implementation
- **AI Systems**: Four-state enemy behaviors with detection, pursuit, and attack patterns
- **Visual Polish**: Particle effects, animations, and camera dynamics for enhanced immersion
- **Audio Integration**: Complete sound design for all gameplay actions

### Technical Implementation
- **Modular Architecture**: Reusable base scene class for shared functionality
- **Object Pooling**: Efficient creation and management of game objects
- **Collision Optimization**: Layer-based collision systems with custom hitboxes
- **State Management**: Clean separation of game state across multiple scenes
