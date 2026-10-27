"use client";

import { createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { Track } from "../types";
import { initialPlayerState, playerReducer } from "./playerReducer";
import { useAudio } from "./useAudio";

const HISTORY_KEY = "userPlayHistory";

export type PlayerApi = {
  togglePlay: (track: Track) => void;
  simpleTogglePlay: () => void;
  initialiseQueue: (tracks: Track[]) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setTimeAndPlay: (track: Track, time: number) => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  skipBackwards: () => void;
  skipForwards: () => void;
  audioElement: HTMLAudioElement | null;
};

type PlayerSnapshot = {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playHistory: string[];
  volume: number;
  isMuted: boolean;
  duration: number;
  currentTime: number;
};

export const PlayerContext = createContext<PlayerSnapshot | null>(null);
export const PlayerApiContext = createContext<PlayerApi | null>(null);

function readSessionHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function nextTrackIndex(currentIndex: number, queueLength: number): number {
  const random = new URLSearchParams(window.location.search).has("random");
  if (!random) return currentIndex + 1;
  if (queueLength <= 1) return 0;
  let index = currentIndex;
  while (index === currentIndex) {
    index = Math.floor(Math.random() * queueLength);
  }
  return index;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playNextRef = useRef<() => void>(() => {});
  const {
    play,
    pause,
    reset,
    mute: muteAudio,
    unmute: unmuteAudio,
    setVolume: setAudioVolume,
    setCurrentTime,
    skipBackwards,
    skipForwards,
    playNewTrack,
    currentTime,
    audioElement,
  } = useAudio(() => playNextRef.current());
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    dispatch({ type: "initialisePlayHistory", playHistory: readSessionHistory() });
    setAudioVolume(0.5);
    return () => dispatch({ type: "stop" });
  }, [setAudioVolume]);

  const remember = useCallback((track: Track) => {
    const history = stateRef.current.playHistory;
    if (history.includes(track.id)) return history;
    const next = [...history, track.id];
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // Private browsing can reject sessionStorage. Playback still works.
    }
    return next;
  }, []);

  const startTrack = useCallback(
    (track: Track, time = 0) => {
      const playHistory = remember(track);
      void playNewTrack(track, time);
      dispatch({ type: "playTrack", track, playHistory });
    },
    [playNewTrack, remember],
  );

  const playNextTrack = useCallback(() => {
    const { currentTrack, queue } = stateRef.current;
    if (queue.length === 0) return;

    const currentIndex = currentTrack ? queue.findIndex((track) => track.id === currentTrack.id) : -1;
    const random = new URLSearchParams(window.location.search).has("random");
    if (!random && currentIndex >= queue.length - 1) {
      reset();
      dispatch({ type: "stop" });
      return;
    }

    const track = queue[nextTrackIndex(currentIndex, queue.length)];
    if (!track) {
      reset();
      dispatch({ type: "stop" });
      return;
    }
    startTrack(track);
  }, [reset, startTrack]);

  const playPreviousTrack = useCallback(() => {
    const { currentTrack, queue } = stateRef.current;
    const currentIndex = currentTrack ? queue.findIndex((track) => track.id === currentTrack.id) : -1;
    if (currentIndex <= 0) {
      reset();
      dispatch({ type: "stop" });
      return;
    }
    const track = queue[currentIndex - 1];
    if (!track) return;
    startTrack(track);
  }, [reset, startTrack]);

  playNextRef.current = playNextTrack;

  const togglePlay = useCallback(
    (track: Track) => {
      const { currentTrack, isPlaying } = stateRef.current;
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          pause();
          dispatch({ type: "stop" });
        } else {
          void play();
          dispatch({ type: "resume" });
        }
        return;
      }
      startTrack(track);
    },
    [pause, play, startTrack],
  );

  const simpleTogglePlay = useCallback(() => {
    const { currentTrack, isPlaying, queue } = stateRef.current;
    if (!currentTrack) {
      const first = queue[0];
      if (first) startTrack(first);
      return;
    }
    if (isPlaying) {
      pause();
      dispatch({ type: "stop" });
    } else {
      void play();
      dispatch({ type: "resume" });
    }
  }, [pause, play, startTrack]);

  const initialiseQueue = useCallback((tracks: Track[]) => {
    dispatch({ type: "initialiseQueue", tracks });
  }, []);

  const setTimeAndPlay = useCallback((track: Track, time: number) => startTrack(track, time), [startTrack]);

  const mute = useCallback(() => {
    muteAudio();
    setIsMuted(true);
  }, [muteAudio]);

  const unmute = useCallback(() => {
    unmuteAudio();
    setIsMuted(false);
  }, [unmuteAudio]);

  const setVolume = useCallback(
    (value: number) => {
      const next = Number(value);
      setAudioVolume(next);
      setVolumeState(next);
    },
    [setAudioVolume],
  );

  const api = useMemo<PlayerApi>(
    () => ({
      togglePlay,
      simpleTogglePlay,
      initialiseQueue,
      playNextTrack,
      playPreviousTrack,
      setTimeAndPlay,
      mute,
      unmute,
      setVolume,
      setCurrentTime,
      skipBackwards,
      skipForwards,
      audioElement,
    }),
    [
      audioElement,
      initialiseQueue,
      mute,
      playNextTrack,
      playPreviousTrack,
      setCurrentTime,
      setTimeAndPlay,
      setVolume,
      simpleTogglePlay,
      skipBackwards,
      skipForwards,
      togglePlay,
      unmute,
    ],
  );

  const snapshot = useMemo<PlayerSnapshot>(
    () => ({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      queue: state.queue,
      playHistory: state.playHistory,
      volume,
      isMuted,
      duration: state.currentTrack?.durationSeconds ?? 0,
      currentTime,
    }),
    [currentTime, isMuted, state, volume],
  );

  return (
    <PlayerApiContext.Provider value={api}>
      <PlayerContext.Provider value={snapshot}>{children}</PlayerContext.Provider>
    </PlayerApiContext.Provider>
  );
}
