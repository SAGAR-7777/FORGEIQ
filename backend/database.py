import time
import random
import math
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional

class Database:
    def __init__(self):
        self.machines: Dict[str, Dict[str, Any]] = {}
        self.sensor_history: Dict[str, List[Dict[str, Any]]] = {}
        self.anomalies: List[Dict[str, Any]] = []
        self.defects: List[Dict[str, Any]] = []
        self.recommendations: List[Dict[str, Any]] = []
        self.agent_runs: List[Dict[str, Any]] = []
        self.agent_messages: List[Dict[str, Any]] = []
        self.documents: List[Dict[str, Any]] = []
        self.rag_chunks: List[Dict[str, Any]] = []
        self.quality_reports: List[Dict[str, Any]] = []
        self.maintenance_events: List[Dict[str, Any]] = []
        self.simulation_runs: List[Dict[str, Any]] = []
        self.operator_actions: List[Dict[str, Any]] = []
        self.system_status = {
            "factory_online": True,
            "stream_active": True,
            "anomaly_injection": None,
            "last_tick": datetime.now(timezone.utc).isoformat(),
            "global_fqi": 94.7,
            "agent_consensus": 92.0
        }
        self.seed_data()

    def seed_data(self):
        # 12 Machines across 4 Industrial Cells
        machine_definitions = [
            {"id": "M-101", "name": "PRESS #01", "type": "Stamping Press", "line": "Line A - Stamping", "status": "normal", "cell": "Stamping Cell", "rpm": 1250, "temp": 194.2, "pressure": 7.4, "vibration": 2.3, "speed": 52.0, "torque": 165.0, "humidity": 42.0, "health": 96.0, "quality_score": 98.2, "defect_prob": 0.04, "prod_count": 3410},
            {"id": "M-102", "name": "PRESS #02", "type": "Hydraulic Press", "line": "Line A - Stamping", "status": "normal", "cell": "Stamping Cell", "rpm": 1320, "temp": 201.5, "pressure": 7.6, "vibration": 3.1, "speed": 54.0, "torque": 172.0, "humidity": 43.5, "health": 92.5, "quality_score": 96.4, "defect_prob": 0.06, "prod_count": 3120},
            {"id": "M-103", "name": "STAMP #03", "type": "High-Speed Blanking", "line": "Line A - Stamping", "status": "normal", "cell": "Stamping Cell", "rpm": 1400, "temp": 210.0, "pressure": 7.9, "vibration": 3.8, "speed": 58.0, "torque": 180.0, "humidity": 44.0, "health": 89.0, "quality_score": 94.1, "defect_prob": 0.09, "prod_count": 2890},
            
            {"id": "M-204", "name": "CNC-MILL #04", "type": "5-Axis CNC Mill", "line": "Line B - Machining", "status": "warning", "cell": "CNC Machining Cell", "rpm": 1620, "temp": 238.4, "pressure": 8.4, "vibration": 6.8, "speed": 72.0, "torque": 215.0, "humidity": 48.0, "health": 74.0, "quality_score": 83.5, "defect_prob": 0.38, "prod_count": 2450},
            {"id": "M-205", "name": "CNC-LATHE #05", "type": "Precision Turning Lathe", "line": "Line B - Machining", "status": "normal", "cell": "CNC Machining Cell", "rpm": 1380, "temp": 205.8, "pressure": 7.3, "vibration": 2.7, "speed": 61.0, "torque": 158.0, "humidity": 45.0, "health": 94.0, "quality_score": 97.2, "defect_prob": 0.05, "prod_count": 2780},
            {"id": "M-206", "name": "CNC-MILL #06", "type": "Horizontal Machining Center", "line": "Line B - Machining", "status": "critical", "cell": "CNC Machining Cell", "rpm": 1780, "temp": 256.1, "pressure": 9.3, "vibration": 8.4, "speed": 84.0, "torque": 245.0, "humidity": 52.0, "health": 61.0, "quality_score": 72.0, "defect_prob": 0.82, "prod_count": 2130},

            {"id": "M-301", "name": "ROBO-WELD #01", "type": "6-Axis Robotic Arc Welder", "line": "Line C - Assembly", "status": "normal", "cell": "Robotic Assembly Cell", "rpm": 0, "temp": 215.0, "pressure": 6.9, "vibration": 2.1, "speed": 48.0, "torque": 140.0, "humidity": 41.0, "health": 97.0, "quality_score": 98.9, "defect_prob": 0.03, "prod_count": 1940},
            {"id": "M-302", "name": "ASSEMBLY #02", "type": "Automated Fastener Cell", "line": "Line C - Assembly", "status": "warning", "cell": "Robotic Assembly Cell", "rpm": 1100, "temp": 222.0, "pressure": 8.1, "vibration": 5.4, "speed": 50.0, "torque": 195.0, "humidity": 46.0, "health": 79.0, "quality_score": 87.0, "defect_prob": 0.28, "prod_count": 1820},
            {"id": "M-303", "name": "SURFACE-FINISH #03", "type": "Robotic Polishing & Deburr", "line": "Line C - Assembly", "status": "maintenance", "cell": "Robotic Assembly Cell", "rpm": 900, "temp": 185.0, "pressure": 6.2, "vibration": 1.8, "speed": 35.0, "torque": 120.0, "humidity": 40.0, "health": 68.0, "quality_score": 91.0, "defect_prob": 0.12, "prod_count": 1450},

            {"id": "M-401", "name": "CMM-INSPECT #01", "type": "Coordinate Measuring Machine", "line": "Line D - Quality Inspection", "status": "normal", "cell": "Inspection Cell", "rpm": 0, "temp": 20.0, "pressure": 5.5, "vibration": 0.4, "speed": 15.0, "torque": 30.0, "humidity": 45.0, "health": 99.0, "quality_score": 99.5, "defect_prob": 0.01, "prod_count": 3950},
            {"id": "M-402", "name": "OPTICAL-SCAN #02", "type": "3D Blue Light Scanner", "line": "Line D - Quality Inspection", "status": "normal", "cell": "Inspection Cell", "rpm": 0, "temp": 21.5, "pressure": 5.0, "vibration": 0.3, "speed": 20.0, "torque": 25.0, "humidity": 44.0, "health": 98.0, "quality_score": 99.1, "defect_prob": 0.02, "prod_count": 3820},
            {"id": "M-403", "name": "XRAY-TEST #01", "type": "Industrial Computed Tomography", "line": "Line D - Quality Inspection", "status": "normal", "cell": "Inspection Cell", "rpm": 0, "temp": 23.0, "pressure": 4.8, "vibration": 0.2, "speed": 10.0, "torque": 20.0, "humidity": 42.0, "health": 95.0, "quality_score": 98.7, "defect_prob": 0.03, "prod_count": 1240}
        ]

        now = datetime.now(timezone.utc)
        for m in machine_definitions:
            self.machines[m["id"]] = m
            # Generate 40 historical telemetry points (every 2 mins)
            history = []
            for i in range(40, -1, -1):
                t = now - timedelta(minutes=i*2)
                # If CNC-MILL #06 or M-204, introduce gradual upward trend
                drift = 0.0
                if m["id"] == "M-206":
                    drift = (40 - i) * 0.12
                elif m["id"] == "M-204":
                    drift = (40 - i) * 0.06

                point = {
                    "timestamp": t.isoformat(),
                    "time_str": t.strftime("%H:%M"),
                    "temperature": round(m["temp"] - drift*2.5 + random.uniform(-1.5, 1.5), 1),
                    "pressure": round(m["pressure"] - drift*0.08 + random.uniform(-0.15, 0.15), 2),
                    "vibration": round(m["vibration"] - drift*0.1 + random.uniform(-0.2, 0.2), 2),
                    "rpm": int(m["rpm"] - drift*15 + random.uniform(-20, 20)),
                    "torque": round(m["torque"] + random.uniform(-3, 3), 1),
                    "speed": round(m["speed"] + random.uniform(-1, 1), 1),
                    "quality_score": max(50.0, round(m["quality_score"] - drift*0.6 + random.uniform(-1, 1), 1)),
                    "defect_prob": min(0.95, max(0.01, round(m["defect_prob"] + drift*0.015 + random.uniform(-0.02, 0.02), 3)))
                }
                history.append(point)
            self.sensor_history[m["id"]] = history

        # Active Anomalies
        self.anomalies = [
            {
                "id": "ANO-2026-901",
                "machine_id": "M-206",
                "machine_name": "CNC-MILL #06",
                "parameter": "Vibration",
                "current_value": 8.4,
                "unit": "mm/s",
                "normal_range": "1.5 - 5.0 mm/s",
                "deviation": "+68.0%",
                "severity": "critical",
                "timestamp": (now - timedelta(minutes=8)).isoformat(),
                "time_str": (now - timedelta(minutes=8)).strftime("%H:%M"),
                "trend": "Increasing for 38 minutes (+1.2 mm/s per 10 min)",
                "ai_explanation": "Abnormal harmonic vibration spike detected across spindle bearing assembly. Strong indication of cutter runout and severe bearing friction.",
                "status": "active"
            },
            {
                "id": "ANO-2026-902",
                "machine_id": "M-206",
                "machine_name": "CNC-MILL #06",
                "parameter": "Temperature",
                "current_value": 256.1,
                "unit": "°C",
                "normal_range": "180 - 230 °C",
                "deviation": "+21.9%",
                "severity": "critical",
                "timestamp": (now - timedelta(minutes=14)).isoformat(),
                "time_str": (now - timedelta(minutes=14)).strftime("%H:%M"),
                "trend": "Thermal runaway detected across spindle nose",
                "ai_explanation": "Thermal expansion coefficient exceeds machining compensation tolerances. High probability of thermal distortion in Z-axis.",
                "status": "active"
            },
            {
                "id": "ANO-2026-885",
                "machine_id": "M-204",
                "machine_name": "CNC-MILL #04",
                "parameter": "Vibration",
                "current_value": 6.8,
                "unit": "mm/s",
                "normal_range": "1.5 - 5.0 mm/s",
                "deviation": "+36.0%",
                "severity": "warning",
                "timestamp": (now - timedelta(minutes=24)).isoformat(),
                "time_str": (now - timedelta(minutes=24)).strftime("%H:%M"),
                "trend": "Gradual upward climb over 31 minutes",
                "ai_explanation": "Secondary vibration harmonics observed at 1450 Hz. Indicates progressive flank wear on carbide end mill #3.",
                "status": "active"
            },
            {
                "id": "ANO-2026-879",
                "machine_id": "M-302",
                "machine_name": "ASSEMBLY #02",
                "parameter": "Pressure",
                "current_value": 8.1,
                "unit": "bar",
                "normal_range": "6.5 - 7.8 bar",
                "deviation": "+12.5%",
                "severity": "warning",
                "timestamp": (now - timedelta(minutes=45)).isoformat(),
                "time_str": (now - timedelta(minutes=45)).strftime("%H:%M"),
                "trend": "Pneumatic regulator cycling frequency elevated",
                "ai_explanation": "Pneumatic pressure fluctuation causing sporadic micro-delays in torque arm clamping sequence.",
                "status": "active"
            }
        ]

        # Predicted Defects
        self.defects = [
            {
                "id": "DEF-701",
                "machine_id": "M-206",
                "machine_name": "CNC-MILL #06",
                "defect_type": "Dimensional Inaccuracy",
                "probability": 0.82,
                "risk_level": "CRITICAL",
                "confidence": 0.91,
                "top_contributors": [
                    {"name": "Temperature deviation", "impact": "+31%", "value": "256.1°C vs 210°C baseline"},
                    {"name": "Pressure instability", "impact": "+24%", "value": "9.3 bar fluctuating"},
                    {"name": "Vibration harmonic", "impact": "+18%", "value": "8.4 mm/s RMS"},
                    {"name": "Tool wear estimate", "impact": "+15%", "value": "78% life consumed"},
                    {"name": "Material variation", "impact": "+12%", "value": "Batch alloy hardness +4 HRC"}
                ],
                "predicted_scrap_rate": "18.4%",
                "affected_batch": "BATCH-2026-09A",
                "similar_incidents": ["INC-882 (Jan 14)", "INC-791 (Dec 03)"],
                "timestamp": now.isoformat()
            },
            {
                "id": "DEF-702",
                "machine_id": "M-204",
                "machine_name": "CNC-MILL #04",
                "defect_type": "Surface Imperfection",
                "probability": 0.38,
                "risk_level": "EARLY WARNING",
                "confidence": 0.86,
                "top_contributors": [
                    {"name": "Vibration increase", "impact": "+42%", "value": "6.8 mm/s vs 3.2 mm/s normal"},
                    {"name": "Feed rate override", "impact": "+28%", "value": "108% programmed speed"},
                    {"name": "Coolant flow drift", "impact": "+18%", "value": "-14% volume flow"}
                ],
                "predicted_scrap_rate": "6.2%",
                "affected_batch": "BATCH-2026-09B",
                "similar_incidents": ["INC-834 (Feb 01)"],
                "timestamp": (now - timedelta(minutes=18)).isoformat()
            }
        ]

        # Recommendations (Human in the loop)
        self.recommendations = [
            {
                "id": "REC-401",
                "machine_id": "M-206",
                "machine_name": "CNC-MILL #06",
                "title": "Reduce Spindle RPM and Lower Thermal Load",
                "action_type": "process_parameter_adjustment",
                "current_params": {"rpm": 1780, "temp": 256.1, "feed_rate": 84, "coolant_flow": 82},
                "recommended_params": {"rpm": 1420, "temp": 218.0, "feed_rate": 68, "coolant_flow": 100},
                "expected_impact": {
                    "defect_probability": "82% → 22%",
                    "quality_score": "72.0 → 93.5",
                    "scrap_reduction": "-12.5%",
                    "production_time": "+3.1%"
                },
                "confidence": 0.94,
                "approval_status": "pending",  # pending, approved, rejected, modified
                "reviewed_by": None,
                "reviewed_at": None,
                "rag_source": {
                    "document": "Haas_CNC_Machining_Center_SOP_704.pdf",
                    "section": "Section 4.3: Thermal Drift Intervention & High-Vibration Mitigation",
                    "relevance": 0.96,
                    "excerpt": "When spindle nose temperature exceeds 245°C or vibration exceeds 7.5 mm/s, immediate reduction of spindle speed by 15-20% and engagement of maximum high-pressure flood coolant restores thermal equilibrium within 6 minutes."
                },
                "reasoning": "Correlating ISO 10816 vibration severity charts with Haas Spindle SOP indicates critical bearing overheat. Reducing RPM to 1420 reduces friction heat generation by 36% while keeping cycle time within acceptable tolerances.",
                "created_at": (now - timedelta(minutes=6)).isoformat()
            },
            {
                "id": "REC-402",
                "machine_id": "M-204",
                "machine_name": "CNC-MILL #04",
                "title": "Offset Tool Wear & Reduce Cutting Speed",
                "action_type": "tool_offset_adjustment",
                "current_params": {"rpm": 1620, "feed_rate": 72, "tool_wear_offset": 0.0},
                "recommended_params": {"rpm": 1500, "feed_rate": 64, "tool_wear_offset": -0.018},
                "expected_impact": {
                    "defect_probability": "38% → 9%",
                    "quality_score": "83.5 → 96.0",
                    "scrap_reduction": "-4.8%",
                    "production_time": "+1.8%"
                },
                "confidence": 0.89,
                "approval_status": "pending",
                "reviewed_by": None,
                "reviewed_at": None,
                "rag_source": {
                    "document": "ISO_9001_2015_Machining_Quality_Control.pdf",
                    "section": "Section 8.5.1: Tool Flank Wear Compensation Thresholds",
                    "relevance": 0.92,
                    "excerpt": "Applying negative tool wear offset of 15-20 µm compensates for progressive flank degradation, eliminating surface chatter marks."
                },
                "reasoning": "Vibration harmonic at 1450 Hz matches flank wear signatures. Negative offset compensates for tool nose radius breakdown.",
                "created_at": (now - timedelta(minutes=15)).isoformat()
            }
        ]

        # Multi-Agent Run Log & Live Messages
        self.agent_runs = [
            {
                "id": "RUN-1092",
                "timestamp": (now - timedelta(minutes=3)).isoformat(),
                "consensus_score": 92.4,
                "status": "completed",
                "duration_ms": 482,
                "trigger": "Anomaly ANO-2026-901 threshold trigger on CNC-MILL #06"
            }
        ]

        self.agent_messages = [
            {
                "agent": "Process Monitoring Agent",
                "agent_role": "Sensor & Telemetry Surveillance",
                "status": "idle",
                "task": "Awaiting next sensor telemetry stream batch",
                "input": "Telemetry packet [M-206: Temp 256.1°C, Vib 8.4 mm/s, RPM 1780]",
                "output": "Critical anomaly flagged on M-206. Vibration spiked +68% above upper control limit (5.0 mm/s).",
                "confidence": 0.98,
                "processing_time": "32ms",
                "last_action": "Dispatched telemetry alert payload to Quality Analysis Agent bus.",
                "reasoning_summary": "Continuous rolling window of 15 samples confirmed monotonic vibration escalation from 4.1 to 8.4 mm/s."
            },
            {
                "agent": "Quality Analysis Agent",
                "agent_role": "Statistical Quality & Baseline Comparison",
                "status": "idle",
                "task": "Comparing M-206 operational curve with historical golden batch (ISO 9001)",
                "input": "Telemetry alert payload from Process Monitoring Agent",
                "output": "Severe operating pattern deviation. Z-score deviation: +3.82 sigma. Operating outside Cpk 1.67 boundary.",
                "confidence": 0.95,
                "processing_time": "68ms",
                "last_action": "Transmitted quality degradation vector to Defect Prediction Agent.",
                "reasoning_summary": "Comparing against 10,000 historical cycles reveals 99.4% correlation with known spindle bearing thermal expansion anomalies."
            },
            {
                "agent": "Defect Prediction Agent",
                "agent_role": "Predictive Failure & Risk Classification",
                "status": "idle",
                "task": "Evaluating multiclass failure probabilities across current batch BATCH-2026-09A",
                "input": "Quality deviation vector + tool wear telemetry",
                "output": "Dimensional Inaccuracy predicted with 82% probability (Risk: CRITICAL). Secondary risk: Surface Scuffing (41%).",
                "confidence": 0.91,
                "processing_time": "114ms",
                "last_action": "Passed defect risk matrix to Process Optimization Agent.",
                "reasoning_summary": "Surrogate defect model (multi-factor sigmoid) identified top 3 contributors: Spindle thermal rise (31%), Pressure fluctuation (24%), and Spindle vibration (18%)."
            },
            {
                "agent": "Process Optimization Agent",
                "agent_role": "Physics-Informed Optimization & Human Decision Support",
                "status": "awaiting_approval",
                "task": "Formulated recipe adjustment REC-401. Holding execution pending operator sign-off.",
                "input": "Defect risk matrix + RAG Knowledge Grounding (Haas SOP Section 4.3)",
                "output": "Recommendation REC-401 generated: Drop RPM 1780 → 1420 (-20%), increase coolant to 100%. Predicted defect reduction: 82% → 22%.",
                "confidence": 0.94,
                "processing_time": "142ms",
                "last_action": "Posted recommendation to Human-in-the-Loop decision queue. Safety interlock engaged.",
                "reasoning_summary": "Simulated thermal response indicates spindle stabilization within 4.5 minutes without compromising cycle time targets."
            }
        ]

        # Incident Replay Events (10:31 to 10:41)
        base_time = now - timedelta(minutes=30)
        self.incident_replay_data = [
            {
                "step": 1,
                "time": "10:31:00",
                "timestamp": (base_time + timedelta(minutes=0)).isoformat(),
                "event": "Normal Production Baseline",
                "status": "normal",
                "temp": 198.4,
                "pressure": 7.4,
                "vibration": 2.2,
                "rpm": 1500,
                "defect_prob": 0.04,
                "quality_score": 98.1,
                "description": "CNC-MILL #06 running standard roughing cycle on Batch #09A. All sensor parameters well within ISO tolerances.",
                "active_agent": "Process Monitoring Agent",
                "agent_thought": "Telemetry parameters within nominal operating bounds. Machine health 98%."
            },
            {
                "step": 2,
                "time": "10:33:00",
                "timestamp": (base_time + timedelta(minutes=2)).isoformat(),
                "event": "Spindle Temperature Incline",
                "status": "normal",
                "temp": 222.0,
                "pressure": 7.5,
                "vibration": 3.4,
                "rpm": 1600,
                "defect_prob": 0.11,
                "quality_score": 94.5,
                "description": "Spindle nose temperature begins gradual rise (+11.8% over 120s). Lubricant delivery rate begins minor decay.",
                "active_agent": "Process Monitoring Agent",
                "agent_thought": "Detecting early thermal rise rate (+0.19°C/s). Monitoring rolling temperature derivative."
            },
            {
                "step": 3,
                "time": "10:35:00",
                "timestamp": (base_time + timedelta(minutes=4)).isoformat(),
                "event": "Vibration Harmonic Anomaly",
                "status": "warning",
                "temp": 238.5,
                "pressure": 7.9,
                "vibration": 5.8,
                "rpm": 1720,
                "defect_prob": 0.29,
                "quality_score": 87.2,
                "description": "Vibration crosses warning boundary (5.0 mm/s). High-frequency accelerometer registers 1450 Hz bearing noise.",
                "active_agent": "Quality Analysis Agent",
                "agent_thought": "Operating state has crossed 2.5 sigma threshold. Quality deviation flagged to defect engine."
            },
            {
                "step": 4,
                "time": "10:36:00",
                "timestamp": (base_time + timedelta(minutes=5)).isoformat(),
                "event": "Anomaly Detected by Monitoring Agent",
                "status": "warning",
                "temp": 246.0,
                "pressure": 8.4,
                "vibration": 6.9,
                "rpm": 1750,
                "defect_prob": 0.48,
                "quality_score": 81.0,
                "description": "Anomaly ANO-2026-901 formally generated. Process Monitoring Agent broadcasts alert to multi-agent bus.",
                "active_agent": "Process Monitoring Agent",
                "agent_thought": "Threshold violation confirmed. Sensor readings exceed safe autonomous threshold."
            },
            {
                "step": 5,
                "time": "10:37:00",
                "timestamp": (base_time + timedelta(minutes=6)).isoformat(),
                "event": "Defect Risk Escalation",
                "status": "critical",
                "temp": 254.2,
                "pressure": 9.1,
                "vibration": 8.1,
                "rpm": 1780,
                "defect_prob": 0.81,
                "quality_score": 73.5,
                "description": "Defect Prediction Agent calculates 81% probability of Dimensional Inaccuracy due to thermal growth of spindle.",
                "active_agent": "Defect Prediction Agent",
                "agent_thought": "Ensemble defect model outputs 81% dimensional error likelihood. Scrap cost projection: $4,200/hr."
            },
            {
                "step": 6,
                "time": "10:38:00",
                "timestamp": (base_time + timedelta(minutes=7)).isoformat(),
                "event": "AI Optimization Recommendation Generated",
                "status": "critical",
                "temp": 256.1,
                "pressure": 9.3,
                "vibration": 8.4,
                "rpm": 1780,
                "defect_prob": 0.82,
                "quality_score": 72.0,
                "description": "Process Optimization Agent retrieves Haas SOP Section 4.3 via RAG and formulates Recipe Adjustment REC-401 (Reduce RPM to 1420, Boost Coolant).",
                "active_agent": "Process Optimization Agent",
                "agent_thought": "Generated parameter intervention. Holding for Human-in-the-Loop operator signoff."
            },
            {
                "step": 7,
                "time": "10:39:00",
                "timestamp": (base_time + timedelta(minutes=8)).isoformat(),
                "event": "Operator Intervention & Approval",
                "status": "warning",
                "temp": 242.0,
                "pressure": 8.2,
                "vibration": 6.1,
                "rpm": 1420,
                "defect_prob": 0.44,
                "quality_score": 85.0,
                "description": "Human operator reviews AI recommendation, inspects telemetry graphs, and clicks [APPROVE]. Controller updates spindle parameters.",
                "active_agent": "Human Operator & Copilot",
                "agent_thought": "Operator approved action. Executed parameter write to CNC controller PLC."
            },
            {
                "step": 8,
                "time": "10:41:00",
                "timestamp": (base_time + timedelta(minutes=10)).isoformat(),
                "event": "Process Stabilized & Golden State Restored",
                "status": "normal",
                "temp": 211.5,
                "pressure": 7.4,
                "vibration": 2.6,
                "rpm": 1420,
                "defect_prob": 0.08,
                "quality_score": 96.8,
                "description": "Cooling flood and reduced RPM eliminate thermal expansion. Vibration drops back to 2.6 mm/s. Zero scrap parts produced.",
                "active_agent": "Multi-Agent System",
                "agent_thought": "Consensus reached: Process returned to in-control state. Batch integrity preserved."
            }
        ]

        # Maintenance records
        self.maintenance_events = [
            {"id": "MAINT-101", "machine_id": "M-206", "machine_name": "CNC-MILL #06", "component": "Spindle Bearing Cartridge", "health": 61, "risk": "HIGH", "operating_hours": 4210, "last_serviced": "2026-04-12", "predicted_rul_days": 14, "recommendation": "Perform vibration analysis and lubricate/replace spindle bearing."},
            {"id": "MAINT-102", "machine_id": "M-204", "machine_name": "CNC-MILL #04", "component": "Carbide Tool Holder #3", "health": 74, "risk": "MEDIUM", "operating_hours": 3150, "last_serviced": "2026-06-20", "predicted_rul_days": 28, "recommendation": "Inspect tool flank wear and recalibrate Z-height sensor."},
            {"id": "MAINT-103", "machine_id": "M-302", "machine_name": "ASSEMBLY #02", "component": "Pneumatic Regulator Seal", "health": 79, "risk": "MEDIUM", "operating_hours": 2800, "last_serviced": "2026-07-04", "predicted_rul_days": 42, "recommendation": "Replace pneumatic seal and calibrate pressure sensor."},
            {"id": "MAINT-104", "machine_id": "M-303", "machine_name": "SURFACE-FINISH #03", "component": "Deburring Spindle Motor", "health": 68, "risk": "HIGH", "operating_hours": 5100, "last_serviced": "2026-03-10", "predicted_rul_days": 18, "recommendation": "Motor armature rewinding scheduled in Maintenance Mode."}
        ]

# Global database singleton
db = Database()
