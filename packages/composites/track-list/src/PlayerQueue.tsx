"use client";

import { usePlayerApi, type Track } from "@web/data";
import { useEffect } from "react";

export function PlayerQueue({ tracks }: { tracks: Track[] }) {
  const { initialiseQueue } = usePlayerApi();

  useEffect(() => {
    initialiseQueue(tracks);
  }, [initialiseQueue, tracks]);

  return null;
}
