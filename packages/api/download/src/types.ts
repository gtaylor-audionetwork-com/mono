export type DownloadOption = {
  id: string;
  label: string;
  format: "mp3" | "wav";
};

export type DownloadRequest = {
  trackId: string;
  optionId: string;
};

export type DownloadResponse = {
  status: "queued";
  trackId: string;
  optionId: string;
};
