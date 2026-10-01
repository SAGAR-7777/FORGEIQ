from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.database import db
from backend.rag.knowledge_base import knowledge_base
from backend.agents.orchestrator import orchestrator
from backend.simulator import simulator
from backend.ml.what_if_simulator import what_if_simulator
from backend.ml.defect_predictor import defect_predictor

router = APIRouter(prefix="/api")

# Models for request validation
class WhatIfRequest(BaseModel):
    current_params: Dict[str, float]
    simulated_params: Dict[str, float]

class FaultInjectionRequest(BaseModel):
    machine_id: str
    fault_type: str

class CopilotChatRequest(BaseModel):
    query: str
    machine_id: Optional[str] = None

class RecommendationActionRequest(BaseModel):
    operator_name: Optional[str] = "Lead Process Engineer"
    notes: Optional[str] = ""
    modified_params: Optional[Dict[str, Any]] = None

class DocumentUploadRequest(BaseModel):
    title: str
    category: str
    filename: str
    content: str

# ----------------- /api/machines -----------------
@router.get("/machines")
def get_machines():
    return list(db.machines.values())

@router.get("/machines/{machine_id}")
def get_machine(machine_id: str):
    machine = db.machines.get(machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    anomalies = [a for a in db.anomalies if a.get("machine_id") == machine_id and a.get("status") == "active"]
    recs = [r for r in db.recommendations if r.get("machine_id") == machine_id and r.get("approval_status") == "pending"]
    history = db.sensor_history.get(machine_id, [])
    
    return {
        "machine": machine,
        "active_anomalies": anomalies,
        "pending_recommendations": recs,
        "telemetry_points_count": len(history)
    }

# ----------------- /api/sensors -----------------
@router.get("/sensors/{machine_id}/history")
def get_sensor_history(machine_id: str):
    history = db.sensor_history.get(machine_id, [])
    return {
        "machine_id": machine_id,
        "history": history
    }

@router.get("/sensors/summary")
def get_sensors_summary():
    machines = list(db.machines.values())
    avg_temp = round(sum(m["temp"] for m in machines) / len(machines), 1)
    avg_vib = round(sum(m["vibration"] for m in machines) / len(machines), 2)
    avg_press = round(sum(m["pressure"] for m in machines) / len(machines), 2)
    return {
        "total_active_channels": len(machines) * 12,
        "avg_temperature": avg_temp,
        "avg_vibration": avg_vib,
        "avg_pressure": avg_press,
        "monitored_parameters": [
            "Temperature", "Pressure", "Vibration", "RPM", "Speed", "Torque", 
            "Humidity", "Cycle Time", "Material Properties", "Production Rate", 
            "Machine Calibration", "Inspection Measurements"
        ]
    }

# ----------------- /api/anomalies -----------------
@router.get("/anomalies")
def get_anomalies():
    return db.anomalies

@router.post("/anomalies/resolve/{anomaly_id}")
def resolve_anomaly(anomaly_id: str):
    for a in db.anomalies:
        if a["id"] == anomaly_id:
            a["status"] = "resolved"
            return {"status": "success", "message": f"Anomaly {anomaly_id} marked resolved"}
    raise HTTPException(status_code=404, detail="Anomaly not found")

# ----------------- /api/quality -----------------
@router.get("/quality/summary")
def get_quality_summary():
    machines = list(db.machines.values())
    avg_quality = round(sum(m["quality_score"] for m in machines) / len(machines), 1)
    avg_defect = round(sum(m["defect_prob"] for m in machines) / len(machines), 3)

    return {
        "forge_quality_index": db.system_status["global_fqi"],
        "fqi_label": "Forge Quality Index™",
        "fqi_disclaimer": "Project-defined composite indicator calculated from process stability, defect probability, sensor health, and material consistency.",
        "factory_quality_score": avg_quality,
        "factory_defect_risk": round(avg_defect * 100, 1),
        "active_anomalies_count": sum(1 for a in db.anomalies if a.get("status") == "active"),
        "machines_online": f"{sum(1 for m in machines if m['status'] != 'maintenance')}/{len(machines)}",
        "average_machine_health": round(sum(m["health"] for m in machines) / len(machines), 1),
        "total_production": sum(m["prod_count"] for m in machines),
        "composite_factors": [
            {"factor": "Process Stability", "weight": "25%", "score": 96.2, "status": "optimal"},
            {"factor": "Defect Probability", "weight": "20%", "score": 91.8, "status": "monitored"},
            {"factor": "Sensor Health", "weight": "15%", "score": 95.4, "status": "optimal"},
            {"factor": "Historical Quality Match", "weight": "15%", "score": 93.7, "status": "optimal"},
            {"factor": "Machine Mechanical Condition", "weight": "15%", "score": 88.5, "status": "warning"},
            {"factor": "Material Alloy Consistency", "weight": "10%", "score": 94.0, "status": "optimal"}
        ]
    }

# ----------------- /api/defects -----------------
@router.get("/defects")
def get_defects():
    return db.defects

@router.post("/defects/predict")
def predict_defect(machine_id: str):
    machine = db.machines.get(machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    prediction = defect_predictor.predict(machine_id, machine["name"], machine)
    return prediction

# ----------------- /api/recommendations -----------------
@router.get("/recommendations")
def get_recommendations():
    return db.recommendations

@router.post("/recommendations/{rec_id}/approve")
def approve_recommendation(rec_id: str, req: RecommendationActionRequest):
    for r in db.recommendations:
        if r["id"] == rec_id:
            r["approval_status"] = "approved"
            r["reviewed_by"] = req.operator_name
            r["reviewed_at"] = datetime.now(timezone.utc).isoformat()
            
            # Apply recommended parameter change to simulated machine
            m_id = r["machine_id"]
            if m_id in db.machines:
                mach = db.machines[m_id]
                rec_params = r["recommended_params"]
                if "rpm" in rec_params:
                    mach["rpm"] = rec_params["rpm"]
                if "temperature" in rec_params:
                    mach["temp"] = rec_params["temperature"]
                mach["quality_score"] = min(98.5, mach["quality_score"] + 15.0)
                mach["defect_prob"] = max(0.04, round(mach["defect_prob"] * 0.25, 2))
                mach["status"] = "normal"
                
                # Mark related anomalies as mitigated
                for ano in db.anomalies:
                    if ano.get("machine_id") == m_id:
                        ano["status"] = "resolved"

            db.operator_actions.insert(0, {
                "action": "APPROVED",
                "recommendation_id": rec_id,
                "operator": req.operator_name,
                "notes": req.notes or "Applied recommended recipe adjustments.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })

            return {
                "status": "success",
                "message": f"Recommendation {rec_id} approved by operator. Machine {m_id} simulated parameters updated successfully.",
                "updated_machine": db.machines.get(m_id)
            }
    raise HTTPException(status_code=404, detail="Recommendation not found")

@router.post("/recommendations/{rec_id}/reject")
def reject_recommendation(rec_id: str, req: RecommendationActionRequest):
    for r in db.recommendations:
        if r["id"] == rec_id:
            r["approval_status"] = "rejected"
            r["reviewed_by"] = req.operator_name
            r["reviewed_at"] = datetime.now(timezone.utc).isoformat()
            
            db.operator_actions.insert(0, {
                "action": "REJECTED",
                "recommendation_id": rec_id,
                "operator": req.operator_name,
                "notes": req.notes or "Operator rejected recommendation.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
            return {"status": "success", "message": f"Recommendation {rec_id} rejected."}
    raise HTTPException(status_code=404, detail="Recommendation not found")

@router.post("/recommendations/{rec_id}/modify")
def modify_recommendation(rec_id: str, req: RecommendationActionRequest):
    for r in db.recommendations:
        if r["id"] == rec_id:
            r["approval_status"] = "modified_and_approved"
            r["reviewed_by"] = req.operator_name
            r["reviewed_at"] = datetime.now(timezone.utc).isoformat()
            if req.modified_params:
                r["recommended_params"].update(req.modified_params)
            
            # Apply modified params to machine
            m_id = r["machine_id"]
            if m_id in db.machines and req.modified_params:
                mach = db.machines[m_id]
                for k, v in req.modified_params.items():
                    if k in mach:
                        mach[k] = v
                mach["status"] = "normal"

            db.operator_actions.insert(0, {
                "action": "MODIFIED_AND_APPROVED",
                "recommendation_id": rec_id,
                "operator": req.operator_name,
                "modified_params": req.modified_params,
                "notes": req.notes or "Operator modified parameter values and approved.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
            return {"status": "success", "message": f"Recommendation {rec_id} modified and approved."}
    raise HTTPException(status_code=404, detail="Recommendation not found")

# ----------------- /api/agents -----------------
@router.get("/agents/status")
def get_agents_status():
    return {
        "consensus_score": db.system_status["agent_consensus"],
        "consensus_label": "Project-Defined Multi-Agent Consensus Metric (Not Industry Standard)",
        "agents": db.agent_messages,
        "runs": db.agent_runs[:5]
    }

@router.get("/agents/messages")
def get_agent_messages():
    return db.agent_messages

@router.post("/agents/run")
async def trigger_agent_run(machine_id: str = "M-206"):
    result = await orchestrator.run_pipeline(machine_id)
    return result

# ----------------- /api/rag -----------------
@router.get("/rag/documents")
def get_rag_documents():
    return knowledge_base.documents

@router.get("/rag/chunks")
def get_rag_chunks():
    return knowledge_base.chunks[:30]

@router.post("/rag/search")
def search_rag(query: str = Query(..., description="Semantic search query"), top_k: int = 4):
    hits = knowledge_base.search(query, top_k=top_k)
    return {
        "query": query,
        "results_count": len(hits),
        "results": hits
    }

@router.post("/rag/upload")
def upload_rag_document(req: DocumentUploadRequest):
    new_doc = knowledge_base.add_document(
        title=req.title,
        category=req.category,
        filename=req.filename,
        content=req.content
    )
    return {"status": "success", "document": new_doc}

# ----------------- /api/reports -----------------
@router.get("/reports/latest")
def get_latest_quality_report():
    now = datetime.now(timezone.utc)
    active_anomalies = [a for a in db.anomalies if a.get("status") == "active"]
    active_defects = db.defects
    recs = [r for r in db.recommendations if r.get("approval_status") == "pending"]

    return {
        "report_id": f"QR-2026-{now.strftime('%m%d')}",
        "generated_at": now.isoformat(),
        "is_simulated_data": True,
        "executive_summary": (
            "During the past 24-hour manufacturing cycle, overall production volume reached 12,480 units with a "
            "Forge Quality Index™ of 94.7/100. Autonomous monitoring identified 3 active anomalies across CNC Machining "
            "and Robotic Assembly lines. Multi-agent root-cause tracing localized the primary risk to spindle bearing "
            "thermal runaway on CNC-MILL #06. Proactive optimization recommendations have been staged for human sign-off, "
            "projecting scrap containment within 2.4%."
        ),
        "production_overview": {
            "total_units": sum(m["prod_count"] for m in db.machines.values()),
            "lines_monitored": 4,
            "machines_active": 11,
            "machines_maintenance": 1,
            "overall_fqi": db.system_status["global_fqi"],
            "scrap_rate": "8.2%"
        },
        "detected_anomalies": active_anomalies,
        "predicted_defects": active_defects,
        "root_causes": [
            {
                "issue": "Spindle Thermal Runaway & High Vibration",
                "affected_machine": "CNC-MILL #06",
                "primary_cause": "Spindle bearing cartridge wear and lubrication starvation under high-rpm titanium roughing",
                "secondary_factor": "Batch alloy hardness +4 HRC causing excessive tool flank friction",
                "recommended_action": "Throttle RPM to 1420 (-20%), engage high-pressure chiller flush, inspect spindle bearing."
            },
            {
                "issue": "Pneumatic Clamping Pressure Cycling",
                "affected_machine": "ASSEMBLY #02",
                "primary_cause": "Regulator seal wear inducing pressure fluctuation between 7.8 and 8.4 bar",
                "secondary_factor": "Torque arm clamping delay",
                "recommended_action": "Recalibrate pneumatic regulator and schedule seal replacement during shift transition."
            }
        ],
        "machine_performance": [
            {"id": m["id"], "name": m["name"], "status": m["status"], "health": m["health"], "quality": m["quality_score"]}
            for m in db.machines.values()
        ],
        "quality_trends": {
            "cpk": 1.48,
            "first_pass_yield": "94.6%",
            "defect_ppm": 480
        },
        "ai_recommendations": recs,
        "risk_assessment": "ELEVATED RISK in Line B (CNC Machining); Line A (Stamping) and Line D (Inspection) remain OPTIMAL.",
        "rag_sources": [
            {"doc": "Haas_CNC_Machining_Center_SOP_704.pdf", "section": "Section 4.3"},
            {"doc": "ISO_9001_2015_Machining_Quality_Control.pdf", "section": "Section 8.5.1"}
        ]
    }

# ----------------- /api/analytics -----------------
@router.get("/analytics/overview")
def get_analytics(timeframe: str = Query("24 Hours", description="Timeframe: 24 Hours, 7 Days, 30 Days")):
    # Realistic analytics charts payload
    return {
        "timeframe": timeframe,
        "quality_trend": [
            {"time": "00:00", "quality": 96.2, "defect_rate": 3.8, "production": 510},
            {"time": "04:00", "quality": 95.8, "defect_rate": 4.2, "production": 525},
            {"time": "08:00", "quality": 96.9, "defect_rate": 3.1, "production": 540},
            {"time": "12:00", "quality": 94.1, "defect_rate": 5.9, "production": 515},
            {"time": "16:00", "quality": 91.5, "defect_rate": 8.5, "production": 490},
            {"time": "20:00", "quality": 94.7, "defect_rate": 5.3, "production": 520}
        ],
        "defect_distribution": [
            {"type": "Dimensional Inaccuracy", "count": 42, "pct": 48.0},
            {"type": "Surface Imperfection", "count": 22, "pct": 25.0},
            {"type": "Assembly Defect", "count": 12, "pct": 14.0},
            {"type": "Material Variation", "count": 8, "pct": 9.0},
            {"type": "Structural Weakness", "count": 4, "pct": 4.0}
        ],
        "machine_comparison": [
            {"name": "PRESS #01", "quality": 98.2, "defects": 1.8, "health": 96},
            {"name": "PRESS #02", "quality": 96.4, "defects": 3.6, "health": 92},
            {"name": "CNC-MILL #04", "quality": 83.5, "defects": 16.5, "health": 74},
            {"name": "CNC-LATHE #05", "quality": 97.2, "defects": 2.8, "health": 94},
            {"name": "CNC-MILL #06", "quality": 72.0, "defects": 28.0, "health": 61},
            {"name": "ROBO-WELD #01", "quality": 98.9, "defects": 1.1, "health": 97},
            {"name": "ASSEMBLY #02", "quality": 87.0, "defects": 13.0, "health": 79},
            {"name": "CMM-INSPECT #01", "quality": 99.5, "defects": 0.5, "health": 99}
        ],
        "parameter_correlation": [
            {"parameter": "Vibration vs Surface Finish", "correlation": 0.88, "impact": "High"},
            {"parameter": "Spindle Temp vs Bore Diameter", "correlation": 0.94, "impact": "Critical"},
            {"parameter": "Hydraulic Pressure vs Clamping Error", "correlation": 0.72, "impact": "Moderate"},
            {"parameter": "Alloy Hardness vs Tool Wear", "correlation": 0.81, "impact": "High"}
        ]
    }

# ----------------- /api/simulation -----------------
@router.post("/simulation/start")
def start_simulation():
    simulator.start()
    return {"status": "success", "stream_active": True}

@router.post("/simulation/pause")
def pause_simulation():
    simulator.pause()
    return {"status": "success", "stream_active": False}

@router.post("/simulation/reset")
def reset_simulation():
    simulator.reset()
    return {"status": "success", "message": "Simulation reset to factory baseline golden state."}

@router.post("/simulation/inject")
async def inject_fault(req: FaultInjectionRequest):
    res = await simulator.inject_fault(req.machine_id, req.fault_type)
    return res

@router.post("/simulation/what-if")
def run_what_if_simulation(req: WhatIfRequest):
    res = what_if_simulator.simulate(req.current_params, req.simulated_params)
    return res

# ----------------- /api/copilot -----------------
@router.post("/copilot/chat")
async def copilot_chat(req: CopilotChatRequest):
    res = await orchestrator.answer_copilot_query(req.query, req.machine_id)
    return res

# ----------------- /api/maintenance -----------------
@router.get("/maintenance")
def get_maintenance():
    return {
        "overall_maintenance_health": 82.5,
        "urgent_attention_count": sum(1 for m in db.maintenance_events if m["risk"] == "HIGH"),
        "events": db.maintenance_events
    }

# ----------------- /api/incident-replay -----------------
@router.get("/incident-replay")
def get_incident_replay():
    return {
        "incident_title": "Incident INC-2026-088: Spindle Bearing Overheat & Defect Prevention",
        "machine_id": "M-206",
        "machine_name": "CNC-MILL #06",
        "total_steps": len(db.incident_replay_data),
        "steps": db.incident_replay_data
    }
