"use client";

import { AddToProjectButton } from "@web/actions/projects";
import { usePlayer } from "@web/data";
import Link from "next/link";
import styles from "./Player.module.css";

export function Player() {
  const { currentTrack, isPlaying, simpleTogglePlay, duration, currentTime } = usePlayer();

  return (
    <div className={styles.player} role="region" aria-label="Player">
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
      <progress
        className={styles.playerProgress}
        value={currentTime}
        max={duration > 0 ? duration : 1}
        aria-label="Playback progress"
      />
    </div>
  );
}
