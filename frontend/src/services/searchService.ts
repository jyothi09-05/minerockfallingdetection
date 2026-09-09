import { SearchResponse, SearchResultItem } from '../types/search';

const API_BASE = 'http://localhost:8000/api/v1/search';

export const searchService = {
  async search(query: string, typeFilter?: string): Promise<SearchResultItem[]> {
    if (!query || !query.trim()) return [];

    try {
      const params = new URLSearchParams({ q: query });
      if (typeFilter) params.append('type', typeFilter);
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (res.ok) {
        const data: SearchResponse = await res.json();
        return data.results;
      }
    } catch {
      // Fallback
    }

    const fallbackRecords: SearchResultItem[] = [
      { id: 'HT-101', type: 'VEHICLE', title: 'CAT 797F Haul Truck #101', subtitle: 'Payload: 380t | Speed: 36 km/h', zone: 'Main Haul Ramp', status: 'OPERATIONAL', link: '/vehicles' },
      { id: 'HT-104', type: 'VEHICLE', title: 'CAT 797F Haul Truck #104', subtitle: 'Brake Temp 118°C | Maintenance Due', zone: 'Crusher Approach', status: 'WARNING', link: '/vehicles' },
      { id: 'ZN-01', type: 'ZONE', title: 'North Highwall (Bench 1300-1450)', subtitle: 'Geotechnical Risk Sector', zone: 'North Sector', status: 'MODERATE_RISK', link: '/geotech-risk' },
      { id: 'CRUSHER-01', type: 'EQUIPMENT', title: 'Primary 60x89 Gyratory Crusher', subtitle: 'Health: 84.5% | RUL: 310 hrs', zone: 'Crusher Area', status: 'HEALTHY', link: '/predictive-maintenance' },
      { id: 'WRK-001', type: 'WORKER', title: 'Marcus Vance', subtitle: 'Drill Specialist | Fatigue: 24%', zone: 'Bench 1350', status: 'ON_SHIFT', link: '/workers' },
      { id: 'SOP-SAF-001', type: 'DOCUMENT', title: 'SOP 01: Blast Exclusion Zone Protocols', subtitle: '500m Personnel & 300m Equipment Radii', zone: 'Knowledge Base', status: 'OFFLINE_DOC', link: '/ai-assistant' }
    ];

    const q = query.toLowerCase();
    return fallbackRecords.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.id.toLowerCase().includes(q) || 
      r.subtitle.toLowerCase().includes(q) ||
      r.zone.toLowerCase().includes(q)
    );
  }
};
