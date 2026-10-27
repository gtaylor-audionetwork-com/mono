import Link from "next/link";
import { getAlbum, getAlbums } from "@web/data/catalogue";
import { TrackList } from "@web/track-list";
import { Card } from "@web/ui";
import styles from "./HomePage.module.css";

const FEATURED_TRACK_LIMIT = 5;

export async function HomePage() {
  const [featuredSummary] = await getAlbums();
  const featuredAlbum = featuredSummary ? await getAlbum(featuredSummary.id) : undefined;
  const featuredTracks = featuredAlbum?.tracks.slice(0, FEATURED_TRACK_LIMIT) ?? [];

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.heading}>New this week</h1>
        <p className={styles.intro}>Fresh tracks added to the catalogue, ready to download in the format you need.</p>
      </div>
      {featuredSummary ? (
        <Card title="Featured album">
          {featuredSummary.artworkUrl ? (
            <img className={styles.artwork} src={featuredSummary.artworkUrl} alt="" />
          ) : null}
          {featuredSummary.shortDescription ? (
            <p className={styles.intro}>{featuredSummary.shortDescription}</p>
          ) : null}
          <p className={styles.cardLink}>
            <Link href={`/album/${featuredSummary.id}`}>Open {featuredSummary.title}</Link>
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
