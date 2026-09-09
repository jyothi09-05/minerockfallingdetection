# MineMind AI — Central Risk Engine Architecture

## 1. Overview & Multi-Model Aggregation

The MineMind Central Risk Engine fuses outputs from all specialized machine learning models to synthesize a single, explainable global mine safety score, granular operational zone assessments, and prioritized triage queues.

```
┌────────────────────────────┐  Weight: 25%
│ Rockfall Prediction Model  │ ─────────────┐
└────────────────────────────┘              │
┌────────────────────────────┐  Weight: 20% │
│ Slope Stability Model      │ ─────────────┤
└────────────────────────────┘              │
┌────────────────────────────┐  Weight: 20% │
│ Fleet Collision Model      │ ─────────────┼──►  Global Composite Mine Risk
└────────────────────────────┘              │     (0.0 to 1.0)
┌────────────────────────────┐  Weight: 15% │
│ Worker Safety & HSI Model  │ ─────────────┤
└────────────────────────────┘              │
┌────────────────────────────┐  Weight: 10% │
│ Environmental Anomaly      │ ─────────────┤
└────────────────────────────┘              │
┌────────────────────────────┐  Weight: 10% │
│ Equipment RUL Model        │ ─────────────┘
└────────────────────────────┘
```

---

## 2. Explainable Factor Attribution

For every inference pass, each model produces a set of normalized `FeatureImportance` objects specifying:
- `feature_name`: Canonical telemetry identifier.
- `feature_value`: Raw sensor measurement.
- `importance_weight`: Proportional contribution to the hazard probability ($0.0 \to 1.0$).
- `impact_direction`: `POSITIVE` (risk driver) or `NEGATIVE` (protective factor).
- `description`: Human-readable engineering context displayed on control room dashboards.

The Central Risk Engine aggregates all positive risk factors across models, sorts them by weighted contribution, and surfaces the top 5 primary root-cause drivers to operators.
