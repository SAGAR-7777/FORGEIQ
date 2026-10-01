from typing import List, Dict, Any

KNOWLEDGE_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "DOC-ISO-9001",
        "title": "ISO 9001:2015 Manufacturing Quality Control Manual",
        "category": "International Standard",
        "filename": "ISO_9001_2015_Machining_Quality_Control.pdf",
        "uploaded_at": "2026-01-15T09:00:00Z",
        "filesize": "2.4 MB",
        "sections_count": 8,
        "is_simulated": True,
        "description": "Standardized requirements for quality management systems in precision machining and fabrication environments.",
        "chunks": [
            {
                "id": "CHUNK-9001-01",
                "section": "Section 8.5.1: Control of Production and Service Provision",
                "content": "Operating machines must be maintained within controlled environmental and process parameters. When critical process parameters (including spindle speed, tool feed, and hydrostatic pressure) deviate beyond statistical control limits (+/- 3 sigma), autonomous process interruption or operator intervention protocols must be triggered immediately.",
                "keywords": ["control limits", "statistical quality", "process deviation", "operator intervention"]
            },
            {
                "id": "CHUNK-9001-02",
                "section": "Section 8.5.2: Tool Flank Wear Compensation Thresholds",
                "content": "In multi-axis subtractive milling, tool flank wear exceeding 0.3mm generates elevated cutting forces and thermal distortion. Applying negative tool wear offset of 15-20 µm or reducing surface cutting speed by 10-15% compensates for progressive nose breakdown, eliminating surface chatter marks and sub-surface micro-fractures.",
                "keywords": ["tool wear", "flank wear", "surface chatter", "compensation offset", "cutting speed"]
            }
        ]
    },
    {
        "id": "DOC-ISO-10816",
        "title": "ISO 10816-3 Mechanical Vibration Severity Standards",
        "category": "Industrial Specification",
        "filename": "ISO_10816_3_Vibration_Evaluation.pdf",
        "uploaded_at": "2026-02-10T14:30:00Z",
        "filesize": "1.8 MB",
        "sections_count": 6,
        "is_simulated": True,
        "description": "Evaluation of machine vibration by measurements on non-rotating parts of industrial machines with nominal power above 15 kW.",
        "chunks": [
            {
                "id": "CHUNK-10816-01",
                "section": "Section 3.2: Vibration Velocity Severity Zones for Rigid Foundation Machines",
                "content": "Zone A: Vibration velocity below 2.3 mm/s RMS (Newly commissioned machines). Zone B: 2.3 to 4.5 mm/s RMS (Unrestricted long-term operation). Zone C: 4.5 to 7.1 mm/s RMS (Warning: Remedial action required at next shift). Zone D: Above 7.1 mm/s RMS (Critical danger of tool damage and structural bearing failure; immediate shutdown or speed curtailment required).",
                "keywords": ["vibration severity", "RMS velocity", "Zone D critical", "bearing failure", "shutdown"]
            },
            {
                "id": "CHUNK-10816-02",
                "section": "Section 4.1: Spindle Bearing Harmonics and Defect Diagnostics",
                "content": "Vibration peaks appearing between 1200 Hz and 1800 Hz typically correspond to outer raceway bearing degradation or insufficient lubrication. When accompanied by temperature rise above 240°C, immediate spindle speed reduction is required to avoid thermal seizure.",
                "keywords": ["bearing harmonics", "spindle lubrication", "outer raceway", "thermal seizure"]
            }
        ]
    },
    {
        "id": "DOC-HAAS-SOP",
        "title": "Haas CNC VF-4 Machining Center Standard Operating Procedure (SOP-704)",
        "category": "Machine Manual & SOP",
        "filename": "Haas_CNC_Machining_Center_SOP_704.pdf",
        "uploaded_at": "2026-03-01T11:15:00Z",
        "filesize": "4.1 MB",
        "sections_count": 12,
        "is_simulated": True,
        "description": "Standardized operation, parameter tuning, thermal growth management, and preventative maintenance for Haas 5-Axis CNC milling centers.",
        "chunks": [
            {
                "id": "CHUNK-HAAS-01",
                "section": "Section 4.3: Thermal Drift Intervention & High-Vibration Mitigation",
                "content": "When spindle nose temperature exceeds 245°C or vibration exceeds 7.5 mm/s, immediate reduction of spindle speed by 15-20% and engagement of maximum high-pressure flood coolant restores thermal equilibrium within 6 minutes. Continued high-speed operation under thermal growth causes Z-axis expansion up to 35 µm, producing fatal dimensional inaccuracies in finished aircraft components.",
                "keywords": ["spindle temperature", "thermal growth", "dimensional inaccuracy", "flood coolant", "speed reduction"]
            },
            {
                "id": "CHUNK-HAAS-02",
                "section": "Section 6.2: Spindle Chiller Calibration and Hydraulic Pressure Stabilizers",
                "content": "The chiller unit must maintain closed-loop coolant delivery at 18°C +/- 1.5°C with hydraulic supply pressure between 7.0 and 8.0 bar. A pressure surge above 9.0 bar signifies filter clogging or regulator lock-up, inducing erratic tool clamp tension.",
                "keywords": ["chiller calibration", "hydraulic pressure", "filter clogging", "tool clamping"]
            }
        ]
    },
    {
        "id": "DOC-DIN-10083",
        "title": "DIN EN 10083 Steels for Quenching and Tempering - Metallurgy & Machinability",
        "category": "Material Specification",
        "filename": "DIN_EN_10083_Steel_Machining_Properties.pdf",
        "uploaded_at": "2026-02-18T16:45:00Z",
        "filesize": "3.2 MB",
        "sections_count": 10,
        "is_simulated": True,
        "description": "Technical delivery conditions for non-alloy and alloy steels for quenching and tempering with cutting speed factor charts.",
        "chunks": [
            {
                "id": "CHUNK-DIN-01",
                "section": "Section 5.4: Hardness Inhomogeneity and Dynamic Cutting Load",
                "content": "When alloy batch hardness varies by more than +/- 3 HRC from nominal 52 HRC, standard carbide inserts experience abrasive wear rate escalation of up to 40%. The adaptive control system should throttle feed rate down by 12% to preserve cutting edge integrity and prevent micro-chipping on outer part edges.",
                "keywords": ["alloy hardness", "feed rate throttling", "carbide inserts", "abrasive wear"]
            }
        ]
    },
    {
        "id": "DOC-IR-088",
        "title": "Incident Root Cause Analysis IR-2026-088: Spindle Bearing Overheat and Scrap Surge",
        "category": "Historical Production Report",
        "filename": "Incident_Report_IR_2026_088.pdf",
        "uploaded_at": "2026-02-28T08:20:00Z",
        "filesize": "1.2 MB",
        "sections_count": 4,
        "is_simulated": True,
        "description": "Detailed multi-disciplinary root cause analysis following scrap surge in CNC Machining Cell during high-load titanium roughing.",
        "chunks": [
            {
                "id": "CHUNK-IR-01",
                "section": "Section 3: Root Cause Findings & Corrective Action Effectiveness",
                "content": "Incident investigation revealed that micro-debris in the spindle lubrication line led to restricted oil-mist mist delivery. This triggered temperature spike to 258°C and vibration escalation to 8.7 mm/s. The resulting Z-axis thermal distortion caused 42 parts to fail bore diameter tolerances (+0.14 mm deviation). Operator approval of automated RPM curtailment (-250 RPM) and coolant flush successfully halted defect generation in subsequent runs.",
                "keywords": ["incident RCA", "oil-mist lubrication", "bore diameter deviation", "RPM curtailment"]
            }
        ]
    }
]
