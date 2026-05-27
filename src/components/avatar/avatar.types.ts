export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'success' | 'error';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarVideoSources = Partial<Record<Exclude<AvatarState, 'listening' | 'error'>, string>>;

export type TalkingGuideAvatarProps = {
  state?: AvatarState;
  message?: string;
  size?: AvatarSize;
  imageSrc?: string;
  videoSources?: AvatarVideoSources;
  onReady?: () => void;
  onError?: (error: Error) => void;
};

export type AvatarProviderState = {
  state: AvatarState;
  source?: string;
  hasVideo: boolean;
};
