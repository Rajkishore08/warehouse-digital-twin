# AI-Powered Warehouse Robot Digital Twin — Industrial Intelligence Demonstrator

A professional, highly realistic, and interactive industrial digital twin built with **React**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **@react-three/drei**, and **Zustand**.

---

## 🏭 Core Industrial Loop

```
PHYSICAL WAREHOUSE
        ↓
ROBOTS + SENSORS (LiDAR, RGB-D, IMU, Encoders, RFID)
        ↓
EDGE INDUSTRIAL GATEWAYS (Wi-Fi 6E / Private 5G Telemetry Streams)
        ↓
REAL-TIME DATA STREAM
        ↓
DIGITAL TWIN ENGINE (60 FPS Spatial Graph & Kinematics)
        ↓
TRAFFIC & PREDICTIVE ANALYTICS ENGINE (30s Ahead Convergence Forecaster)
        ↓
GLOBAL AI ROUTE OPTIMIZER (Multi-Criteria Dynamic A* with Load Balancing)
        ↓
DYNAMIC MULTI-ROBOT REROUTING (Old Red Dashed ➔ New Glowing Green)
        ↓
AUTONOMOUS FLEET ACTUATION (Smooth Acceleration & Intersection Control)
        ↓
WAREHOUSE (Continuous Balanced Operations)
```

---

## 🚀 Key Upgrades & Capabilities

1. **Intelligent Camera Control & First-Person Robot POV**:
   - **Manual Orbit Preservation**: Drag, pan, and zoom with complete freedom without unexpected camera resets.
   - **8 Cinematic Camera Presets**: *Overview*, *Top View*, *Warehouse Floor*, *Aisle View*, *Packing Area*, *Charging Area*, *Receiving Area*, *Dispatch Area*.
   - **`FOLLOW MODE`**: Third-person camera tracking gracefully behind the selected robot.
   - **`ROBOT POV` (First-Person View)**: Camera positions inside the robot's sensor head, rotating and moving naturally with the robot's heading.
   - **Robot POV HUD**: Minimalist head-up display showing live speed (`1.24 m/s`), battery (`74%`), task, destination, remaining distance (`38.4m`), sensor health indicators, and an instant `[ EXIT ROBOT POV ]` button that restores your exact previous viewpoint.

2. **Physical & Digital Navigation Path Network (`[ Paths ]` Toggle)**:
   - Permanent floor navigation lanes connecting Receiving $\to$ Aisles 1-8 $\to$ Central Crossover $\to$ Packing $\to$ Dispatch $\to$ Charging.
   - Digital Technical Overlay: Visualizes all graph nodes, corridor tracks, and animated flow directions.

3. **Collision Avoidance, Spacing & Intersection Right-of-Way**:
   - Natural deceleration when approaching other robots (maintaining a $> 1.1\text{m}$ safety envelope with zero mesh overlap).
   - Intersection control at cross-junctions where yielding robots wait for right-of-way before proceeding.

4. **Clean Sidebar System & Presentation Mode**:
   - Every sidebar panel (Controls, Robot Details, AI Optimizer, Alerts, Timeline) has a `[ − ]` minimize toggle and compact reopen button.
   - **`[ CLEAN VIEW ]`**: One-click distraction-free full-screen 3D view for presentations.

5. **Scenario Control Center & Speed Multipliers**:
   - Speed multipliers: `0.25x`, `0.5x` (slow-mo during extreme congestion), `1x`, `2x`, `5x`.
   - Scenarios:
     - **`[ FREE FLOW ]`**: Optimal balanced operations ($18\%$ traffic density, $1.5\text{ m/s}$ average speed, $0$ bottlenecks).
     - **`[ NORMAL ]`**: Standard 16-robot operations.
     - **`[ +8 ROBOTS ]`**: Inbound fleet surge.
     - **`[ EXTREME CONGESTION ]`**: Severe bottleneck in Aisle 5 ($94\%$ density, $0.28\text{ m/s}$ speed, queue of 11 robots).
     - **`[ EXTREME → RECOVERY ]`**: Automated full-cycle demo (Surge $\to$ Jam $\to$ AI detection $\to$ Multi-robot reroute $\to$ Free flow).
     - **`[ RESET WAREHOUSE ]`**: Full simulation reset.

6. **Interactive Modals**:
   - **12-Step Guided Demo (`[ DEMO MODE ]`)**: Interactive story with auto-focusing cinematic camera.
   - **Learn Mode (`[ Learn ]`)**: Educational guide on AMRs, SLAM, Digital Twins, and Fleet AI.
   - **Architecture Mode (`[ Architecture ]`)**: Interactive 8-layer industrial IoT technology stack.
   - **What-If Simulation Center (`[ What-If ]`)**: Test +10/+20 Robots, Close Aisle 5, Traffic Spikes, and E-Stop.

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Access in browser
# Open: http://localhost:3000/
```
