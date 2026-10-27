"use client";

import { usePlayer, type Track } from "@web/data";
import styles from "./CollectionBeatsPage.module.css";

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function BeatsDeck({ tracks }: { tracks: Track[] }) {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = usePlayer();

  return (
    <div className={styles.deck}>
      <div className={styles.nowPlaying} aria-live="polite">
        {currentTrack ? (
          <>
            <p className={styles.nowLabel}>Currently vibing</p>
            <p className={styles.nowTitle}>{currentTrack.title}</p>
            <p className={styles.nowArtist}>{currentTrack.artist}</p>
            <p className={styles.nowTime}>
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </p>
          </>
        ) : (
          <p className={styles.nowIdle}>Pick a beat. The cats are listening.</p>
        )}
      </div>
      <ul className={styles.trackList}>
        {tracks.map((track, index) => {
          const active = currentTrack?.id === track.id;
          const playing = active && isPlaying;
          return (
            <li key={track.id} className={styles.trackRow}>
              <span className={styles.trackIndex}>{index + 1}</span>
              <div className={styles.trackMeta}>
                <span className={styles.trackTitle}>{track.title}</span>
                <span className={styles.trackArtist}>{track.artist}</span>
              </div>
              <button
                type="button"
                className={playing ? `${styles.playButton} ${styles.playButtonActive}` : styles.playButton}
                onClick={() => togglePlay(track)}
                aria-pressed={playing}
                aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                {playing ? "Paws" : "Play"}
              </button>
            </li>
          );
        })}
      </ul>
      {tracks.length === 0 ? <p className={styles.empty}>No tracks from the API — check Music API env vars.</p> : null}
    </div>
  );
}
