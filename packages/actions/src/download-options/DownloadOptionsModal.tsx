"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDownloadOptions, useDownloadOptionsModal, useRequestDownload } from "@web/data";
import { Button, RadioGroup } from "@web/ui";
import styles from "./DownloadOptionsModal.module.css";

// Render exactly once, from the shell's ModalHost.
export function DownloadOptionsModal() {
  const { track, close } = useDownloadOptionsModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [optionId, setOptionId] = useState<string | null>(null);

  const options = useDownloadOptions(track?.id ?? null);
  const download = useRequestDownload();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (track && !dialog.open) {
      setOptionId(null);
      download.reset();
      dialog.showModal();
    } else if (!track && dialog.open) {
      dialog.close();
    }
  }, [track]);

  useEffect(() => {
    const first = options.data?.[0];
    if (first && optionId === null) setOptionId(first.id);
  }, [options.data, optionId]);

  const handleDownload = () => {
    if (!track || !optionId) return;
    download.mutate({ trackId: track.id, optionId }, { onSuccess: close });
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} onClose={close}>
      {track ? (
        <>
          <h2 id={titleId} className={styles.title}>
            Download options
          </h2>
          <p className={styles.subtitle}>{track.title}</p>

          {options.isPending ? <p className={styles.status}>Loading formats…</p> : null}
          {options.isError ? (
            <p className={styles.status}>Formats couldn’t be loaded. Close this and try again.</p>
          ) : null}
          {options.data ? (
            <RadioGroup
              name="download-format"
              legend="Format"
              options={options.data.map((o) => ({ value: o.id, label: o.label }))}
              value={optionId}
              onChange={setOptionId}
            />
          ) : null}

          {download.isError ? (
            <p className={styles.error} role="alert">
              The download didn’t start. Try again.
            </p>
          ) : null}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={!optionId || download.isPending}>
              {download.isPending ? "Starting download…" : "Download"}
            </Button>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
