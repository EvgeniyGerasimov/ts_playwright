export enum EpisodeTypeAPI {
  TREATMENT = 'TREATMENT',
  PREVENTION = 'PREVENTION',
  PALLIATIVE_CARE = 'PALLIATIVE_CARE',
  DIAGNOSTIC = 'DG',
  REHABILITATION = 'REHAB',
}

export interface Episode {
  episode: {
    name: string;
    start: string;
    type: EpisodeTypeAPI;
  };
}
