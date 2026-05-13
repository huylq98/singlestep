#!/usr/bin/env node
// Usage:
//   npm run new doc <topic>/<slug>
//   npm run new post <slug>
//   npm run new sim <PascalCaseName>

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const [, , kind, name] = process.argv;

if (!kind || !name) {
  console.error('Usage: npm run new <doc|post|sim> <name>');
  process.exit(1);
}

const root = resolve(process.cwd());
const today = new Date().toISOString().slice(0, 10);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeNew(path, content) {
  if (await exists(path)) {
    console.error(`Refusing to overwrite ${path}`);
    process.exit(1);
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
  console.log(`Created ${path}`);
}

if (kind === 'doc') {
  const path = join(root, 'docs', `${name}.mdx`);
  const title = name.split('/').pop().replace(/-/g, ' ');
  await writeNew(
    path,
    `---
title: ${title}
draft: true
---

# ${title}

Write here.
`
  );
} else if (kind === 'post') {
  const path = join(root, 'blog', `${today}-${name}.mdx`);
  await writeNew(
    path,
    `---
slug: ${name}
title: ${name.replace(/-/g, ' ')}
authors: [you]
tags: []
draft: true
---

Write here.

<!-- truncate -->

Continue here.
`
  );
} else if (kind === 'sim') {
  if (!/^[A-Z][A-Za-z0-9]+$/.test(name)) {
    console.error('Sim name must be PascalCase (e.g., KafkaPartitions)');
    process.exit(1);
  }
  const tsxPath = join(root, 'src', 'components', 'sims', `${name}.tsx`);
  await writeNew(
    tsxPath,
    `import { Stage } from '@site/src/components/sim-kit';

export interface ${name}Props {}

export function ${name}(_props: ${name}Props) {
  return (
    <Stage label="${name}">
      <p>${name} sim — implement me.</p>
    </Stage>
  );
}
`
  );

  const testPath = join(root, 'src', 'components', 'sims', `${name}.test.tsx`);
  await writeNew(
    testPath,
    `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders', () => {
    render(<${name} />);
    expect(screen.getByText(/${name}/i)).toBeInTheDocument();
  });
});
`
  );

  console.log(`\nNext: add ${name} to src/components/sims/registry.ts`);
} else {
  console.error(`Unknown kind: ${kind}. Use doc, post, or sim.`);
  process.exit(1);
}
