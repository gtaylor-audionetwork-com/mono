"use client";

import { DownloadOptionsModal } from "@web/actions/download-options";
import { AddToProjectModal } from "@web/actions/projects";

// Every app-wide modal is mounted here, exactly once.
export function ModalHost() {
  return (
    <>
      <DownloadOptionsModal />
      <AddToProjectModal />
    </>
  );
}
