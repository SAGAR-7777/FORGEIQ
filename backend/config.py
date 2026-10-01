import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
APP_NAME = os.getenv("APP_NAME", "FORGEIQ")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# CORS — comma-separated list of allowed origins, e.g. "http://localhost:5173,https://yourdomain.com"
# Defaults to wildcard for local development; restrict in production.
_cors_raw = os.getenv("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in _cors_raw.split(",") if o.strip()] if _cors_raw != "*" else ["*"]

# Manufacturing Parameter Thresholds & Baselines
MACHINE_PARAMETERS = {
    "temperature": {"unit": "°C", "normal_min": 180.0, "normal_max": 230.0, "warning_high": 245.0, "critical_high": 260.0},
    "pressure": {"unit": "bar", "normal_min": 6.5, "normal_max": 8.5, "warning_high": 9.2, "critical_high": 10.5},
    "vibration": {"unit": "mm/s", "normal_min": 1.5, "normal_max": 5.0, "warning_high": 6.5, "critical_high": 8.0},
    "rpm": {"unit": "RPM", "normal_min": 1200, "normal_max": 1600, "warning_high": 1750, "critical_high": 1900},
    "speed": {"unit": "m/min", "normal_min": 45.0, "normal_max": 75.0, "warning_high": 85.0, "critical_high": 95.0},
    "torque": {"unit": "Nm", "normal_min": 120.0, "normal_max": 210.0, "warning_high": 240.0, "critical_high": 270.0},
    "humidity": {"unit": "%RH", "normal_min": 35.0, "normal_max": 55.0, "warning_high": 65.0, "critical_high": 75.0},
    "cycle_time": {"unit": "s", "normal_min": 24.0, "normal_max": 38.0, "warning_high": 45.0, "critical_high": 55.0},
    "material_hardness": {"unit": "HRC", "normal_min": 48.0, "normal_max": 54.0, "warning_high": 58.0, "critical_high": 62.0},
    "production_rate": {"unit": "pcs/hr", "normal_min": 85, "normal_max": 130, "warning_low": 70, "critical_low": 50},
    "calibration_drift": {"unit": "µm", "normal_min": 0.0, "normal_max": 4.0, "warning_high": 8.0, "critical_high": 15.0},
    "inspection_tolerance": {"unit": "mm", "normal_min": -0.05, "normal_max": 0.05, "warning_high": 0.12, "critical_high": 0.25}
}

DEFECT_TYPES = [
    "Dimensional Inaccuracy",
    "Surface Imperfection",
    "Structural Weakness",
    "Material Variation",
    "Assembly Defect"
]
