# Deployment & On-Premise Orchestration

## Environments
1. **Local Development**: `docker-compose up -d`
2. **On-Premise Air-Gapped Mine Server**: Dedicated Docker Swarm / Kubernetes manifests
3. **Edge Gateways**: Lightweight container profiles for field sensor concentrators

## Sub-directories
- `deployment/docker/`: Service-specific container profiles
- `deployment/nginx/`: Reverse proxy, SSL termination, and static asset streaming
- `deployment/k8s/`: Future Kubernetes production manifests
