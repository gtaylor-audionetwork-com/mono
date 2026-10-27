"use client";

import { useAddToProjectModal, useProjectStore } from "@web/data";
import { Button } from "@web/ui";
import { useEffect, useId, useRef } from "react";
import styles from "./AddToProjectModal.module.css";

// Render exactly once, from the shell's ModalHost.
export function AddToProjectModal() {
  const { track, close } = useAddToProjectModal();
  const projects = useProjectStore((state) => state.projects);
  const addTrack = useProjectStore((state) => state.addTrack);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (track && !dialog.open) dialog.showModal();
    else if (!track && dialog.open) dialog.close();
  }, [track]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} onClose={close}>
      {track ? (
        <>
          <h2 id={titleId} className={styles.title}>
            Add to project
          </h2>
          <p className={styles.subtitle}>{track.title}</p>
          <ul className={styles.projects}>
            {projects.map((project) => {
              const alreadyAdded = project.tracks.some((item) => item.id === track.id);
              return (
                <li key={project.id}>
                  <Button
                    variant="secondary"
                    className={styles.projectButton}
                    disabled={alreadyAdded}
                    onClick={() => {
                      addTrack(project.id, track);
                      close();
                    }}
                  >
                    {alreadyAdded ? `${project.name} (added)` : project.name}
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
