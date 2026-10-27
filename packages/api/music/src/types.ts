export type CatalogueTrack = {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  src?: string;
  album?: { id: string; title: string; artworkUrl?: string };
};

export type AlbumSummary = {
  id: string;
  title: string;
  shortDescription: string;
  artworkUrl: string;
};

export type CatalogueAlbum = AlbumSummary & {
  tracks: CatalogueTrack[];
};
