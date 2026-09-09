"""
MineMind AI - Model Registry & Lifecycle Manager
Manages registered machine learning models, active versions, metrics, and metadata.
"""
from typing import Dict, List, Optional
from app.ml.base import BaseMiningModel


class ModelRegistry:
    """Central repository and version manager for all MineMind AI models."""

    def __init__(self):
        self._models: Dict[str, BaseMiningModel] = {}
        self._active_models: Dict[str, str] = {}  # category -> model_name

    def register(self, category: str, model: BaseMiningModel, set_active: bool = True):
        """Registers a model instance under a category."""
        key = f"{category}:{model.name}:{model.version}"
        self._models[key] = model
        if set_active or category not in self._active_models:
            self._active_models[category] = key

    def get_model(self, category: str, version: Optional[str] = None) -> Optional[BaseMiningModel]:
        """Retrieves active model or specific version for category."""
        if version is None:
            active_key = self._active_models.get(category)
            return self._models.get(active_key) if active_key else None

        for key, model in self._models.items():
            if key.startswith(f"{category}:") and model.version == version:
                return model
        return None

    def list_models(self) -> List[Dict]:
        """Returns metadata for all registered models."""
        result = []
        for key, model in self._models.items():
            category = key.split(":")[0]
            is_active = self._active_models.get(category) == key
            meta = model.get_metadata()
            meta["category"] = category
            meta["is_active"] = is_active
            result.append(meta)
        return result


# Global singleton registry
model_registry = ModelRegistry()
