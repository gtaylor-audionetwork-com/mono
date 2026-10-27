"use client";

import { useMutation } from "@tanstack/react-query";
import { requestDownload } from "@web/api-download";

export function useRequestDownload() {
  return useMutation({ mutationFn: requestDownload });
}
