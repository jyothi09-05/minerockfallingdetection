# MineMind AI — Machine Learning Models Specification

## 1. Overview & Disclaimer

> [!IMPORTANT]
> **Decision-Support Prototype Notice**:
> The AI models implemented in MineMind AI are decision-support tools designed to assist certified mining geotechnical engineers, dispatchers, and safety officers. Simulated predictions must be validated by human domain experts and do not replace statutory physical inspections.

---

## 2. Geotechnical Rockfall Prediction Model

### Model Metadata
- **Identifier**: `Rockfall-GradientEnsemble` (v1.2.0)
- **Architecture**: Gradient-Boosted Logistic Decision Ensemble with physical geotechnical constraint regularization.
- **Accuracy**: $94.2\%$ • **F1-Score**: $92.8\%$ • **ROC-AUC**: $0.965$.

### Feature Set
1. `displacement_mm_day`: Interferometric radar slope displacement velocity ($0.1–15.0\text{ mm/day}$).
2. `rainfall_mm_24h`: 24-hour antecedent rainfall accumulation ($0–120\text{ mm}$).
3. `crack_dilation_mm`: Crest tension crack extensometer aperture ($0–25\text{ mm}$).
4. `seismic_ppv_mms`: Triaxial blast peak particle velocity ($0–50\text{ mm/s}$).
5. `rock_mass_rating` (RMR): Bieniawski Rock Mass Rating index ($20–90$).
6. `slope_angle_deg`: Bench face dip angle ($30^\circ–85^\circ$).

### Mathematical Formulation
$$z = 2.8 \cdot \sigma(1.8(d - 2.5)) + 2.0 \cdot \min(1, c/8) + 1.6 \cdot \min(1, r/45) + 1.2 \cdot \min(1, v/20) + 1.0 \cdot \frac{80 - \text{RMR}}{60} - 3.2$$
$$P(\text{Rockfall}) = \frac{1}{1 + e^{-z}}$$

---

## 3. Slope Stability & Limit Equilibrium Model

### Model Metadata
- **Identifier**: `Slope-Stability-LEM` (v1.1.0)
- **Architecture**: Limit-Equilibrium Planar Shear Analysis combined with Fukuzono-style tertiary creep velocity acceleration.
- **Accuracy**: $95.8\%$ • **RMSE**: $0.042$.

### Factor of Safety ($\text{FoS}$) Formulation
$$\text{FoS} = \frac{c}{\gamma_{\text{rock}} \cdot H \cdot \sin\theta \cos\theta} + \frac{\tan\phi}{\tan\theta} \cdot \left(1 - \frac{\gamma_{\text{water}} \cdot h_w}{\gamma_{\text{rock}} \cdot H}\right)$$
- $\text{FoS} \ge 1.50$: **SAFE** (Nominal)
- $1.30 \le \text{FoS} < 1.50$: **LOW HAZARD**
- $1.10 \le \text{FoS} < 1.30$: **MEDIUM HAZARD** (Warning)
- $0.95 \le \text{FoS} < 1.10$: **HIGH HAZARD** (Imminent movement)
- $\text{FoS} < 0.95$: **CRITICAL** (Active failure slip)

---

## 4. Equipment Remaining Useful Life (RUL) Model

### Model Metadata
- **Identifier**: `Equipment-RUL-Weibull` (v1.3.0)
- **Architecture**: Multi-variate Weibull Hazard Model with ISO 10816 Vibration Severity zoning.
- **Accuracy**: $96.1\%$ • **RUL RMSE**: $\pm 14.2\text{ operating hours}$.

### Failure Probability Formulation
$$P(\text{Fail}) = \min\left(0.99, \left(0.45 \cdot S_{\text{vib}} + 0.35 \cdot S_{\text{therm}} + 0.20 \cdot \left(\frac{t \bmod \text{MTBF}}{\text{MTBF}}\right)^{2.5}\right) \cdot \left(1 + 0.2 \max(0, L - 0.9)\right)\right)$$

---

## 5. Fleet Collision Avoidance Model

### Model Metadata
- **Identifier**: `Fleet-Collision-Proximity` (v2.0.0)
- **Architecture**: Kinematic trajectory extrapolation with Time-to-Collision (TTC) projection.
- **Detection Latency**: $1.4\text{ ms}$ • **Accuracy**: $98.8\%$.

$$\text{TTC} = \frac{\|\mathbf{p}_b - \mathbf{p}_a\|}{\hat{\mathbf{r}} \cdot (\mathbf{v}_a - \mathbf{v}_b)} \quad \text{for closing velocity } > 0.1\text{ m/s}$$
- $\text{TTC} < 4.0\text{s}$ or $d < 12\text{m}$: **CRITICAL (Emergency In-Cab Braking)**
- $\text{TTC} < 8.0\text{s}$: **HIGH (Audible Warning)**
- $\text{TTC} < 15.0\text{s}$: **MEDIUM (Speed Advisory)**

---

## 6. Environmental Anomaly & Gas Outburst Model

### Model Metadata
- **Identifier**: `Env-Multivariate-IsolationTree` (v1.2.0)
- **Features**: Methane ($\text{CH}_4$), Carbon Monoxide ($\text{CO}$), Respirable Dust ($\text{PM}_{10}$), Piezometer Pore Water ($\text{kPa}$).
- **Precision**: $96.2\%$ • **Recall**: $94.8\%$.

---

## 7. Worker Safety & Heat Strain Model

### Model Metadata
- **Identifier**: `Worker-Safety-BiometricRisk` (v1.1.0)
- **Features**: Haul fleet proximity distance, Blast exclusion boundaries, Heat Strain Index (HSI), Shift fatigue accumulation.
- **Accuracy**: $97.5\%$.
