// Small decorative SVG icons used by sims. Path data adapted from the Lucide
// icon set (lucide.dev — ISC license). Keep these tiny and dependency-free.

interface IconProps {
  size?: number;
}

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function DatabaseIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

export function MonitorIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

// Official Redis logo (3-disc stylised cube). Path data from Simple Icons
// (simpleicons.org, MIT). Uses Redis brand red — does NOT inherit currentColor,
// so the brand identity stays visible regardless of node state. The node's
// border + scale animations still communicate state.
const REDIS_BRAND = '#DC382C';

export function RedisIcon({ size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={REDIS_BRAND}
    >
      <path d="M10.5752 13.8186l-.4757.0844c-1.9118.3286-3.7754.2562-5.5783-.1903v.0241c.7656.8259 1.9118 1.7806 3.5135 2.5704 1.6017.7898 3.3804 1.0902 5.176.871l5.6505-.7898c1.3128-.1859 2.4711-.3759 3.5135-.871-.4435.5232-1.2092.9745-2.2516 1.3486l-7.3447 1.2371c-2.7156.4585-5.4592-.4827-7.4193-2.3325L0 11.3198l5.2807 1.7686c1.3128.4585 2.6256.7172 3.9384.8259.3286.0241.7172.0241 1.0902 0l9.4452-1.3486-9.1769 1.2532zm0-3.8266l-.4757.0843c-1.9118.3286-3.7754.2562-5.5783-.1903v.0241c.7656.8259 1.9118 1.7806 3.5135 2.5704 1.6017.7898 3.3804 1.0902 5.176.871l5.6505-.7898c1.3128-.1859 2.4711-.3759 3.5135-.871-.4435.5232-1.2092.9745-2.2516 1.3486l-7.3447 1.2371c-2.7156.4585-5.4592-.4827-7.4193-2.3325L0 7.4932l5.2807 1.7686c1.3128.4585 2.6256.7172 3.9384.8259.3286.0241.7172.0241 1.0902 0l9.4452-1.3486-9.1769 1.2532zm0-3.8266l-.4757.0843c-1.9118.3286-3.7754.2562-5.5783-.1903V6.0354c.7656.8259 1.9118 1.7806 3.5135 2.5704 1.6017.7898 3.3804 1.0902 5.176.871L18.8412 8.589c1.3128-.1859 2.4711-.3759 3.5135-.871-.4435.5232-1.2092.9745-2.2516 1.3486l-7.3447 1.2371c-2.7156.4585-5.4592-.4827-7.4193-2.3325L0 3.6666l5.2807 1.7686c1.3128.4585 2.6256.7172 3.9384.8259.3286.0241.7172.0241 1.0902 0l9.4452-1.3486-9.1769 1.2532z" />
    </svg>
  );
}
