"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Track } from "./types";

export type ModalTrack = Pick<Track, "id" | "title">;

type ModalContextValue = {
  track: ModalTrack | null;
  open: (track: ModalTrack) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<ModalTrack | null>(null);
  const open = useCallback((next: ModalTrack) => setTrack(next), []);
  const close = useCallback(() => setTrack(null), []);
  const value = useMemo(() => ({ track, open, close }), [track, open, close]);
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
