export interface SearchResultItem {
  id: string;
  type: 'MINE' | 'ZONE' | 'VEHICLE' | 'EQUIPMENT' | 'WORKER' | 'SENSOR' | 'CAMERA' | 'ALERT' | 'INCIDENT' | 'DOCUMENT';
  title: string;
  subtitle: string;
  zone: string;
  status: string;
  link: string;
}

export interface SearchResponse {
  query: string;
  type_filter?: string;
  count: number;
  results: SearchResultItem[];
}
