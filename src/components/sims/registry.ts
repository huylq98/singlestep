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
    name: 'Redis Replication Lag',
    category: 'Caching',
    blurb: "A subtle Claim Check + Kafka bug — Redisson's default ReadMode.SLAVE lets you read stale or missing data. Toggle between SLAVE / MASTER_SLAVE / MASTER and feel the difference.",
    embeddedAt: '/docs/redis/read-modes',
    Component: RedisReadMode as ComponentType<Record<string, unknown>>,
  },
];
