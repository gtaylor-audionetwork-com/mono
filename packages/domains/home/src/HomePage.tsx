import Link from "next/link";
import { getAlbum, getAlbums } from "@web/data/catalogue";
import { TrackList } from "@web/track-list";
import { Card } from "@web/ui";
import styles from "./HomePage.module.css";

const FEATURED_TRACK_LIMIT = 5;
const FEATURED_COLLECTION = {
  href: "/collection/beats",
  title: "Beats for cats",
  kicker: "Featured collection",
  description: "A standalone campaign deck — custom visuals, same playback API, no catalogue player bar.",
  imageUrl:
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=640&q=80",
  imageAlt: "Cat curator for the Beats collection",
};

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
      <Card title={FEATURED_COLLECTION.kicker}>
        <div className={styles.collectionPromo}>
          <img
            className={styles.collectionArt}
            src={FEATURED_COLLECTION.imageUrl}
            alt={FEATURED_COLLECTION.imageAlt}
            width={640}
            height={480}
          />
          <div className={styles.collectionBody}>
            <p className={styles.collectionTitle}>{FEATURED_COLLECTION.title}</p>
            <p className={styles.intro}>{FEATURED_COLLECTION.description}</p>
            <p className={styles.cardLink}>
              <Link href={FEATURED_COLLECTION.href} target="_blank" rel="noopener noreferrer">
                Open {FEATURED_COLLECTION.title}
              </Link>
            </p>
          </div>
        </div>
      </Card>
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
