# Predictive Maintenance Guide: Primary Gyratory Crusher Maintenance & Failure Diagnostics

**Document ID**: MAINT-MM-CRU-001  
**Version**: 2.5  
**Category**: Fixed Plant Maintenance  
**Applies To**: Fixed Plant Technicians, Reliability Engineers, Condition Monitoring  

---

## 1. Subsystem Overview
The 60x89 Primary Gyratory Crusher processes up to 4,500 metric tonnes per hour of run-of-mine (ROM) ore. Key monitored components include:
- Main shaft eccentric bushing assembly
- Hydraulic spider bearing lubrication loop
- Hydroset positioner and mantle liner wear profile
- Countershaft pinion & gear mesh assembly

## 2. Vibration & Temperature Telemetry Thresholds

| Sensor Metric | Nominal Operating Range | Warning Limit | Trip / Shutdown Limit |
| :--- | :--- | :--- | :--- |
| **Eccentric Bearing Temp** | $45^\circ\text{C} - 65^\circ\text{C}$ | $> 75^\circ\text{C}$ | $> 85^\circ\text{C}$ (Auto interlock stop) |
| **Spider Bearing Temp** | $40^\circ\text{C} - 60^\circ\text{C}$ | $> 70^\circ\text{C}$ | $> 80^\circ\text{C}$ |
| **Drive Pinion RMS Vibration** | $< 2.8\text{ mm/s}$ | $> 4.5\text{ mm/s}$ | $> 7.1\text{ mm/s}$ |
| **Lube Oil Flow Rate** | $120 - 150\text{ L/min}$ | $< 95\text{ L/min}$ | $< 75\text{ L/min}$ |
| **Oil Particle Count (ISO 4406)** | $16/14/11$ | $19/17/14$ | $22/19/16$ (Filter bypass risk) |

## 3. Degradation Diagnostics & Weibull Estimation
1. **Mantle Liner Wear**: Measured daily via ultrasonic gauge. Expected Remaining Useful Life (RUL) follows Weibull distribution with $\beta = 2.4$, $\eta = 420\text{ operating hours}$.
2. **Cavitation / Feed Choke Detection**: Sudden rise in drive motor kilowatt variance ($> 15\%$) coupled with pressure spikes in the hydraulic hydroset circuit indicates uncrushable tramp metal or sub-optimal feed distribution.

## 4. Corrective Action Workflows
- If eccentric bearing temperature exceeds $75^\circ\text{C}$, trigger emergency lube chiller flush and reduce feed rate by 30%.
- If pinion vibration exhibits sideband harmonics at $1\times\text{rpm}$, schedule inspection for gear tooth spalling within 12 operating hours.
