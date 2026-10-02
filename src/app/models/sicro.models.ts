export interface SicroItemDescription {
  id: number;
  source_files: string[];
  group: string;
  description: string;
}


export interface SicroItem {
  id: number;
  code: string;
  source_files: string[];
  descriptions: SicroItemDescription[];
}


export interface SicroItemResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SicroItem[];
}