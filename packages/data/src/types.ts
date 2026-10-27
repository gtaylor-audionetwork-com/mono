export type TrackAlbum = {
  id: string;
  title: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  /** Preview URL. Playback falls back to a timer when this is absent. */
  src?: string;
  album?: TrackAlbum;
};

export type Project = {
  id: string;
  name: string;
  tracks: Track[];
};
