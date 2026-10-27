"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "../types";

const SKIP_SECONDS = 5;
const TICK_MS = 250;

/**
 * HTML audio controls, following anw.player's useAudio.
 * Tracks without `src` advance on a timer so the shell can show progress
 * before a preview URL exists.
 */
export function useAudio(onEnded: () => void) {
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const audioRef = useRef<HTMLAudioElement | null>(typeof window === "undefined" ? null : new Audio());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const simulatingRef = useRef(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [loadedTrackId, setLoadedTrackId] = useState<string | null>(null);

  const publishTime = useCallback((time: number) => {
    currentTimeRef.current = time;
    setCurrentTimeState(time);
  }, []);

  const getAudio = useCallback(() => audioRef.current, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      const next = currentTimeRef.current + TICK_MS / 1000;
      if (next < durationRef.current) {
        publishTime(next);
        return;
      }
      publishTime(durationRef.current);
      clearTimer();
      onEndedRef.current();
    }, TICK_MS);
  }, [clearTimer, publishTime]);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;
    const handleTime = () => {
      if (!simulatingRef.current) publishTime(audio.currentTime);
    };
    const handleEnded = () => {
      if (!simulatingRef.current) onEndedRef.current();
    };
    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [getAudio, publishTime]);

  const playNewTrack = useCallback(
    async (track: Track, time = 0) => {
      clearTimer();
      durationRef.current = track.durationSeconds;
      publishTime(time);
      setLoadedTrackId(track.id);

      const audio = getAudio();
      if (track.src && audio) {
        simulatingRef.current = false;
        audio.src = track.src;
        if (time > 0) {
          audio.addEventListener(
            "loadedmetadata",
            () => {
              audio.currentTime = time;
            },
            { once: true },
          );
        }
        try {
          await audio.play();
        } catch {
          // Autoplay can reject before a user gesture. State still records the track.
        }
        return;
      }

      simulatingRef.current = true;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
      }
      startTimer();
    },
    [clearTimer, getAudio, publishTime, startTimer],
  );

  const play = useCallback(async () => {
    if (simulatingRef.current) {
      startTimer();
      return;
    }
    try {
      await getAudio()?.play();
    } catch {
      // Ignore autoplay rejection; the caller owns isPlaying.
    }
  }, [getAudio, startTimer]);

  const pause = useCallback(() => {
    clearTimer();
    getAudio()?.pause();
  }, [clearTimer, getAudio]);

  const reset = useCallback(() => {
    clearTimer();
    simulatingRef.current = false;
    const audio = getAudio();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    publishTime(0);
  }, [clearTimer, getAudio, publishTime]);

  const mute = useCallback(() => {
    const audio = getAudio();
    if (audio) audio.muted = true;
  }, [getAudio]);

  const unmute = useCallback(() => {
    const audio = getAudio();
    if (audio) audio.muted = false;
  }, [getAudio]);

  const setVolume = useCallback(
    (volume: number) => {
      const audio = getAudio();
      if (audio) audio.volume = volume;
    },
    [getAudio],
  );

  const setCurrentTime = useCallback(
    (time: number) => {
      const next = Math.min(Math.max(0, time), durationRef.current);
      const audio = getAudio();
      if (audio && !simulatingRef.current) audio.currentTime = next;
      publishTime(next);
    },
    [getAudio, publishTime],
  );

  const skipBy = useCallback(
    (delta: number) => {
      setCurrentTime(currentTimeRef.current + delta);
    },
    [setCurrentTime],
  );

  const skipBackwards = useCallback(() => skipBy(-SKIP_SECONDS), [skipBy]);
  const skipForwards = useCallback(() => skipBy(SKIP_SECONDS), [skipBy]);

  return {
    play,
    pause,
    reset,
    mute,
    unmute,
    setVolume,
    setCurrentTime,
    skipBackwards,
    skipForwards,
    playNewTrack,
    currentTime,
    loadedTrackId,
    audioElement: audioRef.current,
  };
}
