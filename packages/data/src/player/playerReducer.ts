import type { Track } from "../types";

export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playHistory: string[];
};

export const initialPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playHistory: [],
};

export type PlayerAction =
  | { type: "playTrack"; track: Track; playHistory: string[] }
  | { type: "resume" }
  | { type: "stop" }
  | { type: "initialiseQueue"; tracks: Track[] }
  | { type: "initialisePlayHistory"; playHistory: string[] };

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "playTrack":
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        playHistory: action.playHistory,
      };
    case "resume":
      return { ...state, isPlaying: true };
    case "stop":
      return { ...state, isPlaying: false };
    case "initialiseQueue":
      return { ...state, queue: action.tracks };
    case "initialisePlayHistory":
      return { ...state, playHistory: action.playHistory };
    default:
      return state;
  }
}
