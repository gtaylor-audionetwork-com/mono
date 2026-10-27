import Link from "next/link";
import { getAlbums } from "@web/data/catalogue";
import { TrackList } from "@web/track-list";
import { Card } from "@web/ui";
import { featuredTracks } from "./sampleTracks";
import styles from "./HomePage.module.css";

export async function HomePage() {
  const [featured] = await getAlbums();

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.heading}>New this week</h1>
        <p className={styles.intro}>Fresh tracks added to the catalogue, ready to download in the format you need.</p>
      </div>
      {featured ? (
        <Card title="Featured album">
          {featured.shortDescription ? <p className={styles.intro}>{featured.shortDescription}</p> : null}
          <p className={styles.cardLink}>
            <Link href={`/album/${featured.id}`}>Open {featured.title}</Link>
          </p>
        </Card>
      ) : null}
      <section>
        <h2 className={styles.sectionHeading}>Featured tracks</h2>
        <TrackList tracks={featuredTracks} />
      </section>
    </div>
  );
}
