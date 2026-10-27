"use client";

import { useContext } from "react";
import { PlayerApiContext, PlayerContext } from "./PlayerProvider";

export function usePlayer() {
  const state = useContext(PlayerContext);
  const api = useContext(PlayerApiContext);
  if (!state || !api) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return { ...state, ...api };
}

export function usePlayerApi() {
  const api = useContext(PlayerApiContext);
  if (!api) {
    throw new Error("usePlayerApi must be used within a PlayerProvider");
  }
  return api;
}
