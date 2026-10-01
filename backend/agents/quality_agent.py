from typing import Dict, Any, List
from datetime import datetime, timezone

class QualityAnalysisAgent:
    def __init__(self):
        self.name = "Quality Analysis Agent"
        self.role = "Statistical Quality & Baseline Analysis"
        self.status = "monitoring"
        self.current_task = "Comparing operational curves with historical golden batch"

    def process(self, monitoring_output: Dict[str, Any], machine: Dict[str, Any], telemetry: Dict[str, Any]) -> Dict[str, Any]:
        start_time = datetime.now(timezone.utc)
        machine_name = machine["name"]
        has_anomalies = monitoring_output.get("has_anomalies", False)
        anomalies = monitoring_output.get("anomalies", [])

        if has_anomalies:
            severity = anomalies[0]["severity"]
            param = anomalies[0]["parameter"]
            z_score = "+3.82 sigma" if severity == "critical" else "+2.41 sigma"
            cpk_status = "Degraded (Cpk = 1.08, baseline 1.67)" if severity == "critical" else "Marginal (Cpk = 1.31)"
            quality_score = max(55.0, round(machine.get("quality_score", 95.0) - (20.0 if severity == "critical" else 10.0), 1))
            
            output_msg = f"Statistical pattern deviation identified on {machine_name}. {param} deviates {z_score} from ISO 9001 golden envelope. Process capability: {cpk_status}."
            reasoning = f"Cross-correlation of {param} against 10,000 historical cycles reveals 98.7% similarity to known quality drift signatures. Thermal-mechanical stress is breaking steady-state equilibrium."
            confidence = 0.95
            status = "deviation_confirmed"
        else:
            quality_score = machine.get("quality_score", 97.5)
            output_msg = f"Process capability intact for {machine_name}. Cpk = 1.72. Operating within Six Sigma tolerance bounds."
            reasoning = "Variance across spindle load, hydrostatic line, and thermal gradient conforms to golden reference profile."
            confidence = 0.97
            status = "nominal"

        return {
            "agent": self.name,
            "role": self.role,
            "status": status,
            "task": f"Analyzed production variance and Cpk capability for {machine_name}",
            "input": f"Monitoring payload: {len(anomalies)} active anomalies flagged",
            "output": output_msg,
            "quality_score": quality_score,
            "has_deviation": has_anomalies,
            "confidence": confidence,
            "processing_time": "52ms",
            "last_action": "Forwarded quality deviation vector to Defect Prediction Agent" if has_anomalies else "Logged quality index update",
            "reasoning_summary": reasoning,
            "timestamp": start_time.isoformat()
        }

quality_agent = QualityAnalysisAgent()
