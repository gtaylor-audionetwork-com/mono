"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalProvider";

export function useDownloadOptionsModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useDownloadOptionsModal must be used inside <ModalProvider>");
  }
  return context;
}
