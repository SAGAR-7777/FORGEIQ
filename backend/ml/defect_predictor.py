import math
from typing import Dict, Any, List
from datetime import datetime, timezone
from backend.config import DEFECT_TYPES

class IndustrialDefectPredictor:
    def __init__(self):
        self.defect_types = DEFECT_TYPES

    def predict(self, machine_id: str, machine_name: str, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        temp = telemetry.get("temperature", telemetry.get("temp", 200.0))
        vib = telemetry.get("vibration", 3.0)
        press = telemetry.get("pressure", 7.5)
        rpm = telemetry.get("rpm", 1400)
        torque = telemetry.get("torque", 160.0)

        # Baseline deviations
        temp_dev = max(0.0, (temp - 215.0) / 215.0)
        vib_dev = max(0.0, (vib - 4.0) / 4.0)
        press_dev = max(0.0, (press - 7.5) / 7.5)
        rpm_dev = max(0.0, (rpm - 1450.0) / 1450.0)

        # Multi-factor probability surrogate
        linear_risk = (temp_dev * 1.6) + (vib_dev * 1.8) + (press_dev * 1.2) + (rpm_dev * 0.8)
        # Sigmoid squash
        probability = 1.0 / (1.0 + math.exp(-3.5 * (linear_risk - 0.45)))
        probability = round(min(0.96, max(0.02, probability)), 2)

        # Risk Classification
        if probability >= 0.70:
            risk_level = "CRITICAL"
        elif probability >= 0.45:
            risk_level = "HIGH RISK"
        elif probability >= 0.20:
            risk_level = "EARLY WARNING"
        else:
            risk_level = "NORMAL"

        # Determine Defect Type based on dominant factor
        if vib_dev > 0.4 and temp_dev > 0.15:
            predicted_defect = "Dimensional Inaccuracy"
        elif vib_dev > 0.3:
            predicted_defect = "Surface Imperfection"
        elif press_dev > 0.25:
            predicted_defect = "Assembly Defect"
        elif temp_dev > 0.25:
            predicted_defect = "Structural Weakness"
        else:
            predicted_defect = "Material Variation"

        # Calculate contributors
        total_dev = temp_dev + vib_dev + press_dev + rpm_dev + 0.01
        temp_contrib = int(round((temp_dev / total_dev) * 65)) + 15
        press_contrib = int(round((press_dev / total_dev) * 55)) + 10
        vib_contrib = int(round((vib_dev / total_dev) * 70)) + 12
        mat_contrib = 100 - (temp_contrib + press_contrib + vib_contrib)
        if mat_contrib < 8:
            mat_contrib = 12

        top_contributors = [
            {"name": "Temperature deviation", "impact": f"+{temp_contrib}%", "value": f"{temp}°C (nominal 200°C)"},
            {"name": "Vibration harmonic", "impact": f"+{vib_contrib}%", "value": f"{vib} mm/s (nominal 3.2 mm/s)"},
            {"name": "Pressure instability", "impact": f"+{press_contrib}%", "value": f"{press} bar (nominal 7.4 bar)"},
            {"name": "Material variation", "impact": f"+{mat_contrib}%", "value": "Alloy hardness tolerance drift"}
        ]

        scrap_pct = round(probability * 22.5, 1)

        return {
            "machine_id": machine_id,
            "machine_name": machine_name,
            "defect_type": predicted_defect,
            "probability": probability,
            "probability_pct": f"{int(round(probability * 100))}%",
            "risk_level": risk_level,
            # confidence is a fixed heuristic value, not empirically validated
            "confidence": 0.91 if risk_level in ["CRITICAL", "HIGH RISK"] else 0.88,
            "confidence_pct": "91%",
            "top_contributors": top_contributors,
            "predicted_scrap_rate": f"{scrap_pct}%",
            "similar_incidents": ["INC-882 (Demo)", "INC-791 (Demo)", "INC-612 (Demo)"],
            "model_type": "multi-factor-sigmoid-surrogate",
            "model_disclaimer": "Demo surrogate model using rule-based thresholds and sigmoid scoring. Not trained on real manufacturing data.",
            "is_demo_data": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

defect_predictor = IndustrialDefectPredictor()
