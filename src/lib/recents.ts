"use client";

import { useSyncExternalStore } from "react";

export interface RecentCase {
  id: string;
  title: string;
}

const KEY = "rochetta_recents";
const MAX = 6;

function readRecents(): RecentCase[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as RecentCase[];
  } catch {
    return [];
  }
}

function writeRecents(list: RecentCase[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

let snapshot: RecentCase[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function refresh(): void {
  const next = readRecents();
  const changed =
    next.length !== snapshot.length ||
    next.some((v, i) => v.id !== snapshot[i]?.id || v.title !== snapshot[i]?.title);
  if (changed) {
    snapshot = next;
    emit();
  }
}

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  listeners.add(cb);
  window.addEventListener("storage", refresh);
  refresh();
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", refresh);
  };
}

const getSnapshot = (): RecentCase[] => snapshot;
const getServerSnapshot = (): RecentCase[] => [];

/** Reactive list of recently viewed cases (localStorage-backed). */
export function useRecents(): RecentCase[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getRecents(): RecentCase[] {
  return readRecents();
}

export function addRecent(id: string, title: string): RecentCase[] {
  if (typeof window === "undefined") return [];
  const updated = [
    { id, title },
    ...readRecents().filter((r) => r.id !== id),
  ].slice(0, MAX);
  writeRecents(updated);
  refresh();
  return updated;
}