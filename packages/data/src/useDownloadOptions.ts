"use client";

import { useQuery } from "@tanstack/react-query";
import { getDownloadOptions } from "@web/api-download";
import { queryKeys } from "./queryKeys";

export function useDownloadOptions(trackId: string | null) {
  return useQuery({
    queryKey: queryKeys.downloadOptions(trackId ?? ""),
    queryFn: () => getDownloadOptions(trackId as string),
    enabled: trackId !== null,
    staleTime: 5 * 60 * 1000,
  });
}
