import type { DownloadOption, DownloadRequest, DownloadResponse } from "./types";

// Next.js inlines NEXT_PUBLIC_* at build time. Declared locally so this package
// needs no Node typings and stays runtime-agnostic.
declare const process: { env: { NEXT_PUBLIC_DOWNLOAD_API_URL?: string } };

// Placeholder endpoints: replace with the real Download API contract.
const baseUrl = process.env.NEXT_PUBLIC_DOWNLOAD_API_URL;

const STUB_OPTIONS: DownloadOption[] = [
  { id: "mp3-320", label: "MP3, 320 kbps", format: "mp3" },
  { id: "wav-16", label: "WAV, 16-bit / 44.1 kHz", format: "wav" },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new Error(`Download API ${init?.method ?? "GET"} ${path} failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function getDownloadOptions(trackId: string): Promise<DownloadOption[]> {
  if (!baseUrl) {
    await delay(300);
    return STUB_OPTIONS;
  }
  return request<DownloadOption[]>(`/tracks/${encodeURIComponent(trackId)}/download-options`);
}

export async function requestDownload(body: DownloadRequest): Promise<DownloadResponse> {
  if (!baseUrl) {
    await delay(400);
    return { status: "queued", ...body };
  }
  return request<DownloadResponse>("/downloads", { method: "POST", body: JSON.stringify(body) });
}
