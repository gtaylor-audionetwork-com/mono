"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Track } from "../types";

type AddToProjectContextValue = {
  track: Track | null;
  open: (track: Track) => void;
  close: () => void;
};

const AddToProjectContext = createContext<AddToProjectContextValue | null>(null);

export function AddToProjectProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null);
  const open = useCallback((next: Track) => setTrack(next), []);
  const close = useCallback(() => setTrack(null), []);
  const value = useMemo(() => ({ track, open, close }), [track, open, close]);
  return <AddToProjectContext.Provider value={value}>{children}</AddToProjectContext.Provider>;
}

export function useAddToProjectModal() {
  const context = useContext(AddToProjectContext);
  if (!context) {
    throw new Error("useAddToProjectModal must be used inside <AddToProjectProvider>");
  }
  return context;
}
