"use client";

import { usePlayer, type Track } from "@web/data";
import { Button } from "@web/ui";

export function PlayTrackButton({ track }: { track: Track }) {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const playingThisTrack = isPlaying && currentTrack?.id === track.id;

  return (
    <Button
      variant="secondary"
      onClick={() => togglePlay(track)}
      aria-label={playingThisTrack ? `Pause ${track.title}` : `Play ${track.title}`}
    >
      {playingThisTrack ? "Pause" : "Play"}
    </Button>
  );
}
