"use client";

import { useDownloadOptionsModal, type ModalTrack } from "@web/data";
import { Button } from "@web/ui";

export function DownloadOptionsButton({ track }: { track: ModalTrack }) {
  const { open } = useDownloadOptionsModal();
  return (
    <Button variant="secondary" onClick={() => open(track)} aria-label={`Download ${track.title}`}>
      Download
    </Button>
  );
}
