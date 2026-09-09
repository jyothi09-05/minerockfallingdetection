# MineMind AI — Local LLM & Assistant Architecture

## 1. Overview
The MineMind AI Mining Intelligence Assistant is designed from first principles for **100% offline, air-gapped, zero-cloud environments**. Modern surface and underground mining operations frequently operate in remote geolocations without guaranteed high-bandwidth internet connectivity. Additionally, proprietary operational, dispatch, and safety data must never leave site boundaries.

```
                    ┌─────────────────────────────────────────┐
                    │      React 18 Control Room UI           │
                    │   (AiAssistant.tsx & Role Personas)     │
                    └────────────────────┬────────────────────┘
                                         │ HTTP REST / WS
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │       FastAPI Assistant Router          │
                    │      (/api/v1/assistant/chat)           │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │       MiningAssistant Orchestrator      │
                    └────────┬───────────┬───────────┬────────┘
                             │           │           │
           ┌─────────────────┘           │           └─────────────────┐
           ▼                             ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│  Internal Tool      │       │ Local RAG Knowledge │       │ Local LLM Provider  │
│  Router & Telemetry │       │ Base & Vector Store │       │ (Deterministic/     │
│  Execution          │       │ (minemind_rag)      │       │  Ollama/LlamaCpp)   │
└──────────┬──────────┘       └──────────┬──────────┘       └──────────┬──────────┘
           │                             │                             │
           └─────────────────────────────┼─────────────────────────────┘
                                         ▼
                              ┌─────────────────────┐
                              │  Safety Guardrails  │
                              │  & Factual Grounding│
                              └──────────┬──────────┘
                                         ▼
                              ┌─────────────────────┐
                              │ Grounded Structured │
                              │ Response + Citations│
                              └─────────────────────┘
```

## 2. Core Architectural Components

### 2.1 Provider Abstraction Layer (`llm/minemind_llm/provider.py`)
- **`BaseLLMProvider`**: Polymorphic interface defining standard contract `generate_response(prompt, system_prompt, context_docs, tool_results, role, temperature)`.
- **`DeterministicMiningLLMProvider`**: Zero-dependency, offline deterministic engine. Guaranteed to operate instantaneously with zero external model weights, synthesizing multi-source telemetry, RAG chunks, and role persona rules.
- **`LocalOllamaProvider`**: Direct JSON HTTP client interfacing with a local Ollama daemon (`http://localhost:11434/api/generate`) executing open-weights models like Llama 3, Mistral 7B, or Gemma 2 locally on mine-site workstations.
- **`LlamaCppProvider`**: Connects to high-performance C++ inference engines using quantized GGUF weights.

### 2.2 Role Personas & Prompt Engineering (`llm/minemind_llm/roles.py`)
Provides 5 specialized domain assistant personas:
1. **Safety Officer (`safety_officer`)**: Enforces TARP escalation, exclusion radius (500m blast, 50m pedestrian), and biometric fatigue thresholds.
2. **Geotechnical Engineer (`geotechnical_engineer`)**: Assesses Bishop limit equilibrium slope stability, factor of safety, radar deformation velocity, and catch berm sizing.
3. **Maintenance Specialist (`maintenance_specialist`)**: Predicts machinery remaining useful life (Weibull RUL), bearing temperatures, and gear vibration harmonics.
4. **Pit Dispatcher (`pit_dispatcher`)**: Coordinates truck-shovel cycle queues, speed compliance, right-of-way rules, and tire TKPH limits.
5. **Mine Operations Manager (`mine_operations_manager`)**: Delivers shift handover reports, composite risk summaries, and holistic KPI tracking.

### 2.3 Conversation Memory (`llm/minemind_llm/memory.py`)
Maintains per-session conversational history with sliding-window trimming, preventing context overflow while preserving recent multi-turn context and citations.
