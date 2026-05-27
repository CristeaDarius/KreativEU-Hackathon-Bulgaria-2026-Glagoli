import type { AvatarState } from './avatar.types';

type Listener = (state: AvatarState) => void;

export class AvatarStateMachine {
  private state: AvatarState;
  private listeners = new Set<Listener>();

  constructor(initialState: AvatarState = 'idle') {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  transition(nextState: AvatarState) {
    this.state = nextState;
    this.listeners.forEach(listener => listener(nextState));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
