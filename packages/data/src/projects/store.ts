"use client";

import { create } from "zustand";
import type { Project, Track } from "../types";

const initialProjects: Project[] = [
  {
    id: "coastal-studies",
    name: "Coastal Studies",
    tracks: [{ id: "t-101", title: "Northbound Lights", artist: "Ellis Marr", durationSeconds: 184 }],
  },
  {
    id: "night-drive",
    name: "Night Drive",
    tracks: [{ id: "t-102", title: "Paper Harbour", artist: "The Quiet Rooms", durationSeconds: 212 }],
  },
  {
    id: "studio-notes",
    name: "Studio Notes",
    tracks: [{ id: "t-103", title: "Glass Orchard", artist: "Mira Okafor", durationSeconds: 157 }],
  },
];

type ProjectState = {
  projects: Project[];
  addTrack: (projectId: string, track: Track) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  addTrack: (projectId, track) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        if (project.tracks.some((item) => item.id === track.id)) return project;
        return { ...project, tracks: [...project.tracks, track] };
      }),
    })),
}));
