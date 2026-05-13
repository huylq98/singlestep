import { test, expect } from '@playwright/test';

test.describe('RedisReadMode sim — landing page embed', () => {
  test('all 4 nodes are visible and contained within the stage', async ({ page }) => {
    await page.goto('/singlestep/');

    const stage = page.getByRole('region', { name: /redis read modes/i });
    await expect(stage).toBeVisible();

    const stageBox = await stage.boundingBox();
    if (!stageBox) throw new Error('stage has no bounding box');

    // Every node must be (a) visible, and (b) fully inside the stage's bounding box.
    for (const label of ['Client', 'Master', 'Replica 1', 'Replica 2']) {
      const node = page.getByText(label, { exact: true }).first();
      await expect(node).toBeVisible();
      const box = await node.boundingBox();
      if (!box) throw new Error(`${label} node has no bounding box`);

      expect(box.y, `${label} top should be inside the stage`).toBeGreaterThanOrEqual(stageBox.y - 1);
      expect(box.y + box.height, `${label} bottom should be inside the stage`).toBeLessThanOrEqual(stageBox.y + stageBox.height + 1);
      expect(box.x, `${label} left should be inside the stage`).toBeGreaterThanOrEqual(stageBox.x - 1);
      expect(box.x + box.width, `${label} right should be inside the stage`).toBeLessThanOrEqual(stageBox.x + stageBox.width + 1);
    }
  });

  test('nodes do not visually overlap each other', async ({ page }) => {
    await page.goto('/singlestep/');

    const labels = ['Client', 'Master', 'Replica 1', 'Replica 2'];
    const boxes = await Promise.all(
      labels.map(async (l) => {
        const node = page.getByText(l, { exact: true }).first();
        const box = await node.boundingBox();
        if (!box) throw new Error(`${l} has no bounding box`);
        return { label: l, ...box };
      })
    );

    // Pairwise: no two node bounding boxes overlap.
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const horizontalOverlap = a.x < b.x + b.width && b.x < a.x + a.width;
        const verticalOverlap = a.y < b.y + b.height && b.y < a.y + a.height;
        const overlap = horizontalOverlap && verticalOverlap;
        expect(overlap, `${a.label} overlaps with ${b.label}`).toBe(false);
      }
    }
  });

  test('Send GET appends an event log entry mentioning the target', async ({ page }) => {
    await page.goto('/singlestep/');
    const log = page.getByRole('log', { name: /event log/i });
    await expect(log).toContainText(/no events yet/i);

    await page.getByRole('button', { name: /^send get$/i }).click();
    await expect(log).toContainText(/master|replica/i);
  });

  test('switching mode to replica routes the next request to a replica', async ({ page }) => {
    await page.goto('/singlestep/');
    await page.getByRole('radio', { name: 'replica', exact: true }).click();
    await page.getByRole('button', { name: /^send get$/i }).click();
    const log = page.getByRole('log', { name: /event log/i });
    await expect(log).toContainText(/replica/i);
  });

  test('reset clears the event log', async ({ page }) => {
    await page.goto('/singlestep/');
    await page.getByRole('button', { name: /^send get$/i }).click();
    const log = page.getByRole('log', { name: /event log/i });
    await expect(log).toContainText(/master|replica/i);

    await page.getByRole('button', { name: /^reset$/i }).click();
    await expect(log).toContainText(/no events yet/i);
  });
});

test.describe('Site smoke tests', () => {
  test('landing page renders hero and CTAs', async ({ page }) => {
    await page.goto('/singlestep/');
    await expect(page.getByRole('heading', { name: 'Singlestep', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /browse the docs/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /play with sims/i })).toBeVisible();
  });

  test('docs/redis/read-modes page renders the sim and prose', async ({ page }) => {
    await page.goto('/singlestep/docs/redis/read-modes');
    await expect(page.getByRole('heading', { name: /redis read modes/i, level: 1 })).toBeVisible();
    await expect(page.getByRole('region', { name: /redis read modes/i })).toBeVisible();
  });

  test('/playground lists the Redis sim', async ({ page }) => {
    await page.goto('/singlestep/playground');
    await expect(page.getByRole('heading', { name: /^playground$/i, level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /redis read modes/i })).toBeVisible();
  });

  test('/about page renders', async ({ page }) => {
    await page.goto('/singlestep/about');
    await expect(page.getByRole('heading', { name: /about singlestep/i })).toBeVisible();
  });

  test('/blog/welcome post renders', async ({ page }) => {
    await page.goto('/singlestep/blog/welcome');
    await expect(page.getByRole('heading', { name: /welcome to singlestep/i })).toBeVisible();
  });
});
