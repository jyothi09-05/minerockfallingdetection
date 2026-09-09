"""
MineMind AI - Base Model Interface & Abstractions
Provides standard lifecycle methods for all local mining AI models:
- Feature preprocessing & validation
- Inference & Confidence scoring
- Explainability & Feature importance attribution
- Serialization & Model metadata
"""
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel, Field


class FeatureImportance(BaseModel):
    feature_name: str
    feature_value: float
    importance_weight: float
    impact_direction: str  # POSITIVE, NEGATIVE, NEUTRAL
    description: str


class PredictionResult(BaseModel):
    model_name: str
    model_version: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: str  # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    contributing_factors: List[FeatureImportance] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class BaseMiningModel(ABC):
    """Abstract base class for all local MineMind predictive models."""

    def __init__(self, name: str, version: str = "1.0.0", description: str = ""):
        self.name = name
        self.version = version
        self.description = description
        self.is_trained: bool = True
        self.trained_at: datetime = datetime.now(timezone.utc)
        self.metrics: Dict[str, float] = {}

    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> PredictionResult:
        """Runs model inference on raw input features."""
        pass

    @abstractmethod
    def explain(self, features: Dict[str, Any]) -> List[FeatureImportance]:
        """Calculates feature importance and explainable risk factors."""
        pass

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "description": self.description,
            "is_trained": self.is_trained,
            "trained_at": self.trained_at.isoformat(),
            "metrics": self.metrics,
        }
