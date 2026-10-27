import Link from "next/link";
import { TrackList } from "@web/track-list";
import { getAlbum } from "@web/data/catalogue";
import { Card } from "@web/ui";
import styles from "./AlbumPage.module.css";

export async function AlbumPage({ id }: { id: string }) {
  const album = await getAlbum(id);

  if (!album) {
    return (
      <div className={styles.page}>
        <Card title="Album not found">
          <p className={styles.missing}>There’s no album with ID “{id}”. Choose one from Albums.</p>
        </Card>
        <Link href="/" className={styles.homeButton}>
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card title={album.title}>
        {album.artworkUrl ? <img className={styles.artwork} src={album.artworkUrl} alt="" /> : null}
        <p className={styles.meta}>{album.shortDescription}</p>
      </Card>
      <TrackList tracks={album.tracks} numbered />
      <Link href="/" className={styles.homeButton}>
        Home
      </Link>
    </div>
  );
}
