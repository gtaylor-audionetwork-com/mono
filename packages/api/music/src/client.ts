import type { AlbumSummary, CatalogueAlbum, CatalogueTrack } from "./types";

const FIRST_ALBUMS = 6;
const TRACK_LIMIT = 200;
const TRACK_CHUNK = 100;
const CORE_CATALOGUE_ID = "1";

declare const process: { env: { MUSIC_API_URL?: string; MUSIC_API_KEY?: string } };

type MusicAlbum = {
  number: number;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  artworkImageUrl?: string | null;
};

type MusicTrack = {
  id: number;
  title: string;
  duration: number;
  mix?: number | null;
  albumTrackNumber?: number | null;
  previewUrl?: string | null;
  composers?: { name?: string | null }[] | null;
  album?: { number?: number | null } | null;
};

function trackIdList(input: string | string[]): string[] {
  const ids = Array.isArray(input) ? input : input.split(",");
  return ids.map((id) => id.trim()).filter(Boolean);
}

function previewSrc(track: MusicTrack, albumNumber?: number): string | undefined {
  if (track.previewUrl) return track.previewUrl;
  const album = albumNumber ?? track.album?.number;
  if (album == null || track.albumTrackNumber == null) return undefined;
  const trackNumber = String(track.albumTrackNumber).padStart(2, "0");
  return `https://preview.audionetwork.com/Preview/tracks/mp3/v5res/ANW${album}/${trackNumber}.mp3`;
}

function toTrack(track: MusicTrack, album?: { id: string; title: string }): CatalogueTrack {
  const albumNumber = album ? Number(album.id) : track.album?.number ?? undefined;
  return {
    id: String(track.id),
    title: track.title,
    artist: track.composers?.[0]?.name ?? "",
    durationSeconds: track.duration,
    src: previewSrc(track, albumNumber),
    album,
  };
}

function toSummary(album: MusicAlbum): AlbumSummary {
  return {
    id: String(album.number),
    title: album.name,
    shortDescription: album.shortDescription || album.description || "",
    artworkUrl: album.artworkImageUrl || "",
  };
}

async function musicGet<T>(path: string): Promise<T | undefined> {
  const baseUrl = process.env.MUSIC_API_URL;
  const apiKey = process.env.MUSIC_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("Set MUSIC_API_URL and MUSIC_API_KEY to fetch the catalogue.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "X-API-KEY": apiKey, Accept: "application/json" },
  });
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`Music API GET ${path} failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

/** Same job as music app `getTracks`: resolve tracks by id, in the requested order. */
export async function getTracks(trackIdsInput: string | string[]): Promise<CatalogueTrack[]> {
  const ids = trackIdList(trackIdsInput);
  if (ids.length === 0) return [];

  const fetched: MusicTrack[] = [];
  for (let index = 0; index < ids.length; index += TRACK_CHUNK) {
    const chunk = ids.slice(index, index + TRACK_CHUNK);
    const path =
      chunk.length === 1
        ? `/tracks/${chunk[0]}?include=royaltysplits`
        : `/tracks?ids=${chunk.join(",")}&include=royaltysplits`;
    const body = await musicGet<MusicTrack | MusicTrack[]>(path);
    if (!body) continue;
    fetched.push(...(Array.isArray(body) ? body : [body]));
  }

  const byId = new Map(fetched.map((track) => [String(track.id), track]));
  return ids.flatMap((id) => {
    const track = byId.get(id);
    return track ? [toTrack(track)] : [];
  });
}

/** Same job as music app `getAlbum`: one album, with its main-mix tracks. */
export async function getAlbum(albumId: string): Promise<CatalogueAlbum | undefined> {
  const album = await musicGet<MusicAlbum>(`/albums/${encodeURIComponent(albumId)}`);
  if (!album) return undefined;

  const rawTracks = await musicGet<MusicTrack[]>(
    `/albums/${encodeURIComponent(albumId)}/tracks?include=royaltysplits`,
  );
  const tracks = (rawTracks ?? [])
    .filter((track) => track.mix === 1)
    .slice(0, TRACK_LIMIT)
    .map((track) => toTrack(track, { id: String(album.number), title: album.name }));

  return { ...toSummary(album), tracks };
}

export async function getAlbums(): Promise<AlbumSummary[]> {
  const albums = await musicGet<MusicAlbum[]>(`/albums?catalogueIds=${CORE_CATALOGUE_ID}`);
  return (albums ?? []).slice(0, FIRST_ALBUMS).map(toSummary);
}
