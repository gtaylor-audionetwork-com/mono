import Link from "next/link";
import { getAlbums } from "@web/data/catalogue";
import { Card } from "@web/ui";
import styles from "./AlbumsPage.module.css";

export async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.heading}>Albums</h1>
        <p className={styles.intro}>The first six albums in the core catalogue.</p>
      </div>
      <div className={styles.list}>
        {albums.map((album) => (
          <Card key={album.id} title={album.title}>
            {album.artworkUrl ? <img className={styles.artwork} src={album.artworkUrl} alt="" /> : null}
            <p className={styles.description}>{album.shortDescription}</p>
            <p className={styles.link}>
              <Link href={`/album/${album.id}`}>Open {album.title}</Link>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
