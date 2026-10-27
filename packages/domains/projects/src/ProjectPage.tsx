"use client";

import { useProjectStore } from "@web/data";
import { TrackList } from "@web/track-list";
import { Card } from "@web/ui";
import styles from "./ProjectPage.module.css";

export function ProjectPage({ id }: { id: string }) {
  const project = useProjectStore((state) => state.projects.find((item) => item.id === id));

  if (!project) {
    return (
      <Card title="Project not found">
        <p className={styles.missing}>There’s no project with ID “{id}”. Choose one from the sidebar.</p>
      </Card>
    );
  }

  const trackCount = project.tracks.length;

  return (
    <div className={styles.page}>
      <Card title={project.name}>
        <p className={styles.meta}>
          {trackCount} {trackCount === 1 ? "track" : "tracks"}
        </p>
      </Card>
      <TrackList tracks={project.tracks} />
    </div>
  );
}
