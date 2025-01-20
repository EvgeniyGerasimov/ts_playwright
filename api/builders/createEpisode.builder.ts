import { Episode, EpisodeTypeAPI } from '../../models/episode.model';
import { getDateHelper } from '../../utils/helpers';

export class CreateEpisodeBuilder {
  private model: Episode;
  constructor(icpc2Name: string, episodeType: EpisodeTypeAPI = EpisodeTypeAPI.TREATMENT) {
    this.model = {
      episode: {
        name: `${icpc2Name}`,
        start: getDateHelper(-16, 'minutes'),
        type: episodeType,
      },
    };
  }

  public build() {
    return this.model;
  }
}
