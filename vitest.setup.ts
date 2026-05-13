import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// @testing-library/react's asyncWrapper checks `typeof jest !== 'undefined'`
// to determine whether fake timers are active, then calls jest.advanceTimersByTime(0)
// to drain the fake setTimeout it uses for microtask flushing. In vitest, `jest` is
// not a global by default, so the drain never happens and fake-timer tests hang.
// Aliasing `jest` → `vi` restores the expected behaviour.
Object.defineProperty(globalThis, 'jest', { value: vi, writable: true, configurable: true });
