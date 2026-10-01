import asyncio
import random
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from backend.database import db
from backend.agents.orchestrator import orchestrator

class ManufacturingDataSimulator:
    def __init__(self):
        self.is_running = True
        self.interval_seconds = 3.0
        self._task: Optional[asyncio.Task] = None

    def start(self):
        self.is_running = True
        db.system_status["stream_active"] = True

    def pause(self):
        self.is_running = False
        db.system_status["stream_active"] = False

    def reset(self):
        db.seed_data()
        db.system_status["anomaly_injection"] = None
        db.system_status["stream_active"] = True
        self.is_running = True

    async def inject_fault(self, machine_id: str, fault_type: str) -> Dict[str, Any]:
        machine = db.machines.get(machine_id)
        if not machine:
            raise ValueError(f"Machine {machine_id} not found")

        db.system_status["anomaly_injection"] = {
            "machine_id": machine_id,
            "machine_name": machine["name"],
            "fault_type": fault_type,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        # Mutate machine telemetry based on fault type
        if fault_type == "temperature_spike":
            machine["temp"] = 258.4
            machine["vibration"] = max(machine["vibration"], 6.2)
            machine["status"] = "critical"
        elif fault_type == "pressure_spike":
            machine["pressure"] = 10.4
            machine["temp"] = max(machine["temp"], 232.0)
            machine["status"] = "critical"
        elif fault_type == "vibration_anomaly":
            machine["vibration"] = 8.6
            machine["rpm"] = max(machine["rpm"], 1750)
            machine["status"] = "critical"
        elif fault_type == "tool_wear":
            machine["vibration"] = 7.1
            machine["temp"] = 236.0
            machine["health"] = 62.0
            machine["status"] = "warning"
        elif fault_type == "material_variation":
            machine["torque"] = 245.0
            machine["vibration"] = 5.9
            machine["speed"] = 78.0
            machine["status"] = "warning"
        elif fault_type == "machine_degradation":
            machine["health"] = 54.0
            machine["vibration"] = 7.8
            machine["temp"] = 248.0
            machine["status"] = "critical"

        # Trigger multi-agent pipeline immediately on this machine
        pipeline_result = await orchestrator.run_pipeline(machine_id, machine)

        # Append to sensor history
        now = datetime.now(timezone.utc)
        hist_entry = {
            "timestamp": now.isoformat(),
            "time_str": now.strftime("%H:%M:%S"),
            "temperature": machine["temp"],
            "pressure": machine["pressure"],
            "vibration": machine["vibration"],
            "rpm": machine["rpm"],
            "torque": machine.get("torque", 160.0),
            "speed": machine.get("speed", 60.0),
            "quality_score": machine["quality_score"],
            "defect_prob": machine["defect_prob"]
        }
        if machine_id in db.sensor_history:
            db.sensor_history[machine_id].append(hist_entry)
            if len(db.sensor_history[machine_id]) > 60:
                db.sensor_history[machine_id].pop(0)

        return {
            "fault_type": fault_type,
            "machine": machine,
            "pipeline_result": pipeline_result
        }

    async def step_simulation(self):
        if not self.is_running:
            return

        now = datetime.now(timezone.utc)
        db.system_status["last_tick"] = now.isoformat()

        # Slight realistic stochastic jitter across machines
        for m_id, m in db.machines.items():
            if m["status"] == "maintenance":
                continue

            # Stochastic perturbation
            m["temp"] = round(max(150.0, m["temp"] + random.uniform(-0.4, 0.4)), 1)
            m["pressure"] = round(max(4.0, m["pressure"] + random.uniform(-0.04, 0.04)), 2)
            m["vibration"] = round(max(0.5, m["vibration"] + random.uniform(-0.06, 0.06)), 2)
            if m["rpm"] > 0:
                m["rpm"] = int(max(800, m["rpm"] + random.randint(-5, 5)))

            # Append to history every cycle
            hist = db.sensor_history.setdefault(m_id, [])
            hist.append({
                "timestamp": now.isoformat(),
                "time_str": now.strftime("%H:%M:%S"),
                "temperature": m["temp"],
                "pressure": m["pressure"],
                "vibration": m["vibration"],
                "rpm": m["rpm"],
                "torque": m.get("torque", 160.0),
                "speed": m.get("speed", 60.0),
                "quality_score": m["quality_score"],
                "defect_prob": m["defect_prob"]
            })
            if len(hist) > 60:
                hist.pop(0)

simulator = ManufacturingDataSimulator()
