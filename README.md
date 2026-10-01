# FORGEIQ
### AI Manufacturing Quality Intelligence
> **Predict defects. Understand causes. Optimize production.**

ForgeIQ is an enterprise-grade AI decision-support platform for modern manufacturing. It continuously monitors process telemetry across industrial machine lines, detects micro-anomalies and statistical drift, predicts potential product defects before metal or polymers deform, traces root causes through an explainable causal directed acyclic graph (DAG), grounds interventions in verified engineering manuals and ISO/DIN standards via RAG, simulates virtual process recipe adjustments via a physics-informed surrogate model, and enforces strict Human-in-the-Loop operator sign-off before modifying controller setpoints.

---

## Architecture Overview

```
Manufacturing Edge Telemetry (OPC-UA / MQTT)
       │
       ▼
Data Validation & Normalization Pipeline
       │
       ▼
Process Monitoring Agent (Sensory Surveillance)
       │
       ▼
Quality Analysis Agent (SPC Cpk & Statistical Deviation)
       │
       ▼
Multivariate Anomaly Detection (IsolationForest / Dynamic Z-Score)
       │
       ▼
Defect Prediction Agent (RandomForest Multiclass Classifier)
       │
       ▼
Explainable Root Cause Causal Graph (SHAP Feature Importance)
       │
       ▼
RAG Knowledge Center (Semantic Retrieval: ISO 9001, ISO 10816-3, Haas SOP-704, DIN EN 10083)
       │
       ▼
Process Optimization Agent (Physics-Informed Recipe Formulator)
       │
       ▼
What-If Production Simulator (Virtual Parameter Tuning)
       │
       ▼
Human-in-the-Loop Safety Interlock (Operator Approval Queue)
       │
       ▼
Machine Controller Setpoint Write & Zero-Defect Restoration
```

---

## 4 Mandatory Multi-Agent System

1. **Process Monitoring Agent**
   - Continuously evaluates 12 high-frequency sensor channels across 12 plant machines (Temperature, Pressure, Vibration, RPM, Speed, Torque, Humidity, Cycle Time, Material Properties, Production Rate, Machine Calibration, Inspection Tolerances).
   - Flags upper control limit breaches and harmonic vibration zone transitions (ISO 10816 Zone D).

2. **Quality Analysis Agent**
   - Compares live operational curves with historical golden batch profiles.
   - Calculates statistical z-score deviations (+3.82 sigma shift) and process capability indices ($C_{pk}$).
   - Explains non-random pattern drifts against Six Sigma baselines.

3. **Defect Prediction Agent**
   - Forecasts defect probabilities (e.g. 82% failure likelihood) and multiclass defect categories:
     - *Dimensional Inaccuracy*
     - *Surface Imperfection*
     - *Structural Weakness*
     - *Material Variation*
     - *Assembly Defect*
   - Computes feature importance contributions (e.g. Temp deviation +31%, Pressure instability +24%, Vibration +18%, Material variation +12%).

4. **Process Optimization Agent**
   - Formulates corrective machine recipes (e.g., throttle spindle RPM by -20%, boost high-pressure flood coolant to 100%).
   - Grounds recommendations in technical documents retrieved through semantic RAG.
   - **Safety Interlock**: Stalls execution in staging until authorized by a certified operator.

---

## Key Features

- **Digital Factory Twin**: Interactive factory map with live SVG flow paths, machine health badges, and drill-down telemetry drawers across Stamping, 5-Axis CNC Machining, Robotic Assembly, and Metrology Inspection cells.
- **What-If Production Simulator**: Virtual sliders for Spindle Temperature, Hydraulic Clamping Pressure, Cutting RPM, Feed Rate, and Coolant Delivery. Directly projects changes in Defect Probability (78% → 24%), Quality Score (82 → 94), Estimated Scrap (18% → 7%), and Production Time (+2.4%).
- **AI Root-Cause Graph**: Interactive 5-stage causal DAG mapping predicted defects back to sensor anomalies, root causes (bearing lubrication starvation, alloy hardness variations), and engineering interventions.
- **RAG Knowledge Center**: Semantic vector search over industrial documents (ISO 9001:2015, ISO 10816-3, Haas VF-4 SOP-704, DIN EN 10083, Incident IR-2026-088) with relevance scores and chunk inspections.
- **Incident Replay**: Step-by-step forensic playback of Incident INC-2026-088 (10:31 Normal → 10:33 Thermal Rise → 10:35 Vibration Harmonic → 10:37 Defect Risk Escalated → 10:38 AI Optimization Generated → 10:39 Operator Sign-off → 10:41 Process Stabilized).
- **Manufacturing Copilot**: Natural language conversational assistant answering live plant questions with RAG citations and telemetry grounding.
- **Data Simulator & Fault Injector**: Interactive fault triggers (Vibration Spike, Thermal Runaway, Pressure Surge, Tool Flank Wear, Material Hardness Drift, Machine Degradation) that invoke the entire multi-agent reactive swarm in real time.
- **AI Quality Report Generator**: Generates exportable, printable compliance reports with executive summaries, detected anomalies, root causes, and Cpk metrics.
- **Forge Quality Index™ (FQI)**: Project-defined composite indicator ($94.7 / 100$) calculated from process stability (25%), defect probability (20%), sensor health (15%), historical quality (15%), machine mechanical condition (15%), and material alloy consistency (10%).

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Vite
- **Backend API**: Python 3.12, FastAPI, Uvicorn, Pydantic v2
- **Machine Learning**: scikit-learn (RandomForest, IsolationForest), NumPy, Pandas
- **RAG Engine**: Vector embeddings, TF-IDF semantic indexer, Cosine similarity
- **Multi-Agent Orchestration**: IBM Langflow & IBM Orchestrate interoperable architecture
- **Inference**: High-speed LLM engine via Groq LLaMA-3.3-70B with deterministic industrial rule-based fallback

---

## Quickstart & Execution

### 1. Launch FastAPI Backend
```bash
cd backend
# Activate virtual environment
.venv\Scripts\activate    # On Windows
# Run uvicorn server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### 2. Access the Application
Open your browser to:
```
http://localhost:8000
```
FastAPI automatically serves the production-compiled React application from `frontend/dist`.

To run the frontend in development mode with Hot Module Reloading:
```bash
cd frontend
npm run dev
```
Access Vite dev server at `http://localhost:5173` (proxies `/api` to port 8000).

---

## 8-Step Guided Demo Tour

Click **[START GUIDED DEMO]** in the top navigation or sidebar to run through the full 2–3 minute demonstration:
1. **Start Factory**: Initializes all 12 machines in nominal golden baseline status.
2. **Detect Anomaly**: Injects an 8.6 mm/s vibration spike on CNC-MILL #06.
3. **Analyze Quality**: Quality Analysis Agent detects +3.82 sigma deviation and Cpk degradation.
4. **Predict Defect**: Defect Prediction Agent projects 82% Dimensional Inaccuracy risk.
5. **Explain Root Cause**: Root-Cause Graph visualizes causal link from bearing raceway wear to thermal expansion.
6. **Run What-If Simulation**: Test lowering Spindle RPM 1780 → 1420 and boosting flood coolant to 100%.
7. **Approve Recommendation**: Operator executes Human-in-the-Loop sign-off for recipe REC-401.
8. **Restore Quality**: Observes machine parameters update, defect risk drop to 24%, and golden quality restored!
