import type { ComponentType } from 'react';

export interface SimEntry {
  id: string;
  name: string;
  category: string;
  /** One-line description for the playground card. */
  blurb: string;
  /** Path of the docs/blog page where this sim is embedded. */
  embeddedAt: string;
  Component: ComponentType<Record<string, unknown>>;
}

export const sims: SimEntry[] = [
  // Sims are appended here by Task 18.
];
