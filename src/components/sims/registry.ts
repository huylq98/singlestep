import type { ComponentType } from 'react';
import { RedisReadMode } from './RedisReadMode';

export interface SimEntry {
  id: string;
  name: string;
  category: string;
  blurb: string;
  embeddedAt: string;
  Component: ComponentType<Record<string, unknown>>;
}

export const sims: SimEntry[] = [
  {
    id: 'redis-read-mode',
    name: 'Redis read modes',
    category: 'Caching',
    blurb: 'Toggle between master/replica reads and watch traffic re-route in real time.',
    embeddedAt: '/docs/redis/read-modes',
    Component: RedisReadMode as ComponentType<Record<string, unknown>>,
  },
];
