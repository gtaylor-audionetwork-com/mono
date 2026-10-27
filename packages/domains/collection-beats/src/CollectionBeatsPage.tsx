import { getAlbum, getAlbums } from "@web/data/catalogue";
import type { Metadata } from "next";
import Link from "next/link";
import { BeatsDeck } from "./BeatsDeck";
import styles from "./CollectionBeatsPage.module.css";

const BEATS_TRACK_LIMIT = 6;
const CAT_HERO =
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80";

export const collectionBeatsPageMetadata: Metadata = {
  title: "Collection — Beats (marketing)",
};

export async function CollectionBeatsPage() {
  const albums = await getAlbums();
  const source = albums[1] ?? albums[0];
  const detail = source ? await getAlbum(source.id) : undefined;
  const tracks = detail?.tracks.slice(0, BEATS_TRACK_LIMIT) ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>(marketing) · headless player</p>
        <h1 className={styles.title}>Beats for cats</h1>
        <p className={styles.lede}>
          Standalone campaign page: fetches its own tracks, drives playback through the shared player API, and
          deliberately skips the catalogue player bar.
        </p>
        <figure className={styles.catFrame}>
          <img
            className={styles.catImage}
            src={CAT_HERO}
            alt="A cat lounging — unofficial beats curator"
            width={1200}
            height={900}
          />
        </figure>
        <Link className={styles.backLink} href="/">
          Escape to the normal catalogue
        </Link>
      </header>
      <BeatsDeck tracks={tracks} />
    </div>
  );
}
