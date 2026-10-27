"use client";

import { AddToProjectButton } from "@web/actions/projects";
import { usePlayer } from "@web/data";
import Link from "next/link";
import styles from "./Player.module.css";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function Player() {
  const { currentTrack, isPlaying, simpleTogglePlay, duration, currentTime, setCurrentTime } = usePlayer();
  const maxTime = duration > 0 ? duration : 1;
  const scrubValue = Math.min(currentTime, maxTime);
  const artworkUrl = currentTrack?.album?.artworkUrl;

  return (
    <div className={styles.player} role="region" aria-label="Player">
      {currentTrack && artworkUrl ? (
        <img className={styles.artwork} src={artworkUrl} alt="" width={56} height={56} />
      ) : null}
      <button className={styles.playerButton} type="button" onClick={simpleTogglePlay}>
        {isPlaying ? "Stop playing" : "Start playing"}
      </button>
      {currentTrack ? (
        <div className={styles.nowPlaying}>
          <p className={styles.trackTitle}>{currentTrack.title}</p>
          {currentTrack.album ? (
            <Link className={styles.albumLink} href={`/album/${currentTrack.album.id}`}>
              From the album {currentTrack.album.title}
            </Link>
          ) : null}
        </div>
      ) : null}
      {currentTrack ? <AddToProjectButton track={currentTrack} /> : null}
      <div className={styles.scrubberWrap}>
        <span className={styles.time} aria-hidden="true">
          {formatTime(scrubValue)}
        </span>
        <input
          type="range"
          className={styles.scrubber}
          min={0}
          max={maxTime}
          step={0.25}
          value={scrubValue}
          disabled={!currentTrack}
          onChange={(event) => setCurrentTime(Number(event.target.value))}
          aria-label="Playback progress"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={scrubValue}
          aria-valuetext={`${formatTime(scrubValue)} of ${formatTime(duration)}`}
        />
        <span className={styles.time} aria-hidden="true">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
