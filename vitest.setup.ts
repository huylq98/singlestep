import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// @testing-library/react's asyncWrapper checks `typeof jest !== 'undefined'`
// to determine whether fake timers are active, then calls jest.advanceTimersByTime(0)
// to drain the fake setTimeout it uses for microtask flushing. In vitest, `jest` is
// not a global by default, so the drain never happens and fake-timer tests hang.
// Aliasing `jest` → `vi` restores the expected behaviour.
Object.defineProperty(globalThis, 'jest', { value: vi, writable: true, configurable: true });

// jsdom does not implement ResizeObserver. Components that use it for
// responsive layout (e.g., RedisReadMode computing arrow endpoints from
// rendered node positions) need a stub. A no-op constructor is enough for
// tests — bounding rects aren't reliable in jsdom anyway, so we don't rely
// on the callback firing.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
}
