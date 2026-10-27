import type { Track } from "@web/data";
import { PlayerQueue } from "./PlayerQueue";
import { TrackRow } from "./TrackRow";
import styles from "./TrackList.module.css";

export type TrackListProps = {
  tracks: Track[];
  /** Show track numbers, e.g. for an album running order. */
  numbered?: boolean;
};

export function TrackList({ tracks, numbered = false }: TrackListProps) {
  return (
    <>
      <PlayerQueue tracks={tracks} />
      <ol className={styles.list}>
        {tracks.map((track, index) => (
          <TrackRow key={track.id} track={track} number={numbered ? index + 1 : undefined} />
        ))}
      </ol>
    </>
  );
}
