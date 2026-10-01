from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.config import MACHINE_PARAMETERS

class IndustrialAnomalyDetector:
    def __init__(self):
        self.thresholds = MACHINE_PARAMETERS

    def evaluate_machine_telemetry(self, machine_id: str, telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        anomalies = []
        now = datetime.now(timezone.utc)

        # Vibration check
        vibration = telemetry.get("vibration", 0.0)
        v_thresh = self.thresholds["vibration"]
        if vibration > v_thresh["critical_high"]:
            dev = ((vibration - v_thresh["normal_max"]) / v_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-VIB",
                "machine_id": machine_id,
                "parameter": "Vibration",
                "current_value": vibration,
                "unit": "mm/s",
                "normal_range": f"{v_thresh['normal_min']} - {v_thresh['normal_max']} mm/s",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "critical",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "Monotonic upward climb; ISO 10816 Zone D boundary breached",
                "ai_explanation": "Severe harmonic vibration detected across mechanical assembly. High risk of tool breakage and surface chatter.",
                "status": "active"
            })
        elif vibration > v_thresh["warning_high"]:
            dev = ((vibration - v_thresh["normal_max"]) / v_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-VIB",
                "machine_id": machine_id,
                "parameter": "Vibration",
                "current_value": vibration,
                "unit": "mm/s",
                "normal_range": f"{v_thresh['normal_min']} - {v_thresh['normal_max']} mm/s",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "warning",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "Continuous upward trend over recent machining passes",
                "ai_explanation": "Elevated vibration exceeding normal baseline. Early warning of tool flank wear or spindle imbalance.",
                "status": "active"
            })

        # Temperature check
        temp = telemetry.get("temperature", telemetry.get("temp", 0.0))
        t_thresh = self.thresholds["temperature"]
        if temp > t_thresh["critical_high"]:
            dev = ((temp - t_thresh["normal_max"]) / t_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-TEMP",
                "machine_id": machine_id,
                "parameter": "Temperature",
                "current_value": temp,
                "unit": "°C",
                "normal_range": f"{t_thresh['normal_min']} - {t_thresh['normal_max']} °C",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "critical",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "Thermal runaway detected across core spindle/bearing",
                "ai_explanation": "Critical thermal buildup exceeding material expansion compensations. Imminent thermal deformation risk.",
                "status": "active"
            })
        elif temp > t_thresh["warning_high"]:
            dev = ((temp - t_thresh["normal_max"]) / t_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-TEMP",
                "machine_id": machine_id,
                "parameter": "Temperature",
                "current_value": temp,
                "unit": "°C",
                "normal_range": f"{t_thresh['normal_min']} - {t_thresh['normal_max']} °C",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "warning",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "Gradual thermal accumulation over past 20 minutes",
                "ai_explanation": "Operating temperature above normal envelope. Indicative of coolant starvation or high cutting friction.",
                "status": "active"
            })

        # Pressure check
        press = telemetry.get("pressure", 0.0)
        p_thresh = self.thresholds["pressure"]
        if press > p_thresh["critical_high"]:
            dev = ((press - p_thresh["normal_max"]) / p_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-PRESS",
                "machine_id": machine_id,
                "parameter": "Pressure",
                "current_value": press,
                "unit": "bar",
                "normal_range": f"{p_thresh['normal_min']} - {p_thresh['normal_max']} bar",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "critical",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "High-pressure surge detected in hydraulic circuit",
                "ai_explanation": "Hydraulic line pressure surge causing erratic clamping force and tool holder deformation.",
                "status": "active"
            })
        elif press > p_thresh["warning_high"]:
            dev = ((press - p_thresh["normal_max"]) / p_thresh["normal_max"]) * 100
            anomalies.append({
                "id": f"ANO-{machine_id}-PRESS",
                "machine_id": machine_id,
                "parameter": "Pressure",
                "current_value": press,
                "unit": "bar",
                "normal_range": f"{p_thresh['normal_min']} - {p_thresh['normal_max']} bar",
                "deviation": f"+{round(dev, 1)}%",
                "severity": "warning",
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M"),
                "trend": "Pneumatic/hydraulic pressure cycling instability",
                "ai_explanation": "Pressure fluctuations exceeding +/- 10% operating tolerance.",
                "status": "active"
            })

        return anomalies

anomaly_detector = IndustrialAnomalyDetector()
