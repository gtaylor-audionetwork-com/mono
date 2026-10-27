"use client";

import { useAddToProjectModal, type Track } from "@web/data";
import { Button } from "@web/ui";

export function AddToProjectButton({ track }: { track: Track }) {
  const { open } = useAddToProjectModal();
  return (
    <Button variant="secondary" onClick={() => open(track)} aria-label={`Add ${track.title} to project`}>
      Add to project
    </Button>
  );
}
