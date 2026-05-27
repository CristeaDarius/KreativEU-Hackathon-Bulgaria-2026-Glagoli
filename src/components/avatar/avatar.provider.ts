import type { AvatarProviderState, AvatarState, AvatarVideoSources } from './avatar.types';

export interface AvatarProvider {
  getState(state: AvatarState): AvatarProviderState;
}

export class LocalVideoAvatarProvider implements AvatarProvider {
  constructor(private readonly sources: AvatarVideoSources = {}) {}

  getState(state: AvatarState): AvatarProviderState {
    const source = this.sources[state as keyof AvatarVideoSources];

    return {
      state,
      source,
      hasVideo: Boolean(source),
    };
  }
}

// Future streaming providers should implement AvatarProvider and return a source
// or stream-backed renderer state here. This keeps the component independent from
// vendors such as HeyGen, D-ID, Tavus, Synthesia, or future internal services.
export const createAvatarProvider = (sources?: AvatarVideoSources): AvatarProvider => {
  return new LocalVideoAvatarProvider(sources);
};
