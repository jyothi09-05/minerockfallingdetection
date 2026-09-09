"""
MineMind AI - Machine Learning Package Root
Initializes all local models and registers them with the Model Registry.
"""
from app.ml.registry import model_registry
from app.ml.rockfall import RockfallPredictionModel
from app.ml.slope_stability import SlopeStabilityModel
from app.ml.equipment_failure import EquipmentFailureModel
from app.ml.collision import CollisionPredictionModel
from app.ml.environmental import EnvironmentalAnomalyModel
from app.ml.worker_safety import WorkerSafetyModel

# Register all default production models
model_registry.register("rockfall", RockfallPredictionModel())
model_registry.register("slope_stability", SlopeStabilityModel())
model_registry.register("equipment_failure", EquipmentFailureModel())
model_registry.register("collision", CollisionPredictionModel())
model_registry.register("environmental", EnvironmentalAnomalyModel())
model_registry.register("worker_safety", WorkerSafetyModel())

__all__ = [
    "model_registry",
    "RockfallPredictionModel",
    "SlopeStabilityModel",
    "EquipmentFailureModel",
    "CollisionPredictionModel",
    "EnvironmentalAnomalyModel",
    "WorkerSafetyModel",
]
