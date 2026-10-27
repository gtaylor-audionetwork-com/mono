import { DownloadOptionsButton } from "@web/actions/download-options";
import { PlayTrackButton } from "@web/actions/play";
import { AddToProjectButton } from "@web/actions/projects";
import type { Track } from "@web/data";
import styles from "./TrackList.module.css";

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function TrackRow({ track, number }: { track: Track; number?: number }) {
  return (
    <li className={number === undefined ? `${styles.row} ${styles.unnumbered}` : styles.row}>
      {number !== undefined ? <span className={styles.number}>{number}</span> : null}
      <span>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
      </span>
      <span className={styles.duration}>{formatDuration(track.durationSeconds)}</span>
      <PlayTrackButton track={track} />
      <DownloadOptionsButton track={{ id: track.id, title: track.title }} />
      <AddToProjectButton track={track} />
    </li>
  );
}
