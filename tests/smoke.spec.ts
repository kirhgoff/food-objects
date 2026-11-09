import { expect, test } from '@playwright/test';

test('submitting feedback lands on the thanks page', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your feedback').fill('Love it');
  await page.getByLabel('Email (optional)').fill('fan@example.com');
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page).toHaveURL(/\/thanks\/$/);
  await expect(page.getByRole('heading', { name: 'Thanks for your feedback' })).toBeVisible();
});

test('empty message is rejected', async ({ request }) => {
  const response = await request.post('/api/feedback', { form: { message: '' } });
  expect(response.status()).toBe(400);
});

test('GET is not allowed', async ({ request }) => {
  const response = await request.get('/api/feedback');
  expect(response.status()).toBe(405);
});

test('JSON body is rejected', async ({ request }) => {
  const response = await request.post('/api/feedback', { data: { message: 'hi' } });
  expect(response.status()).toBe(415);
});

test('missing body is rejected', async ({ request }) => {
  const response = await request.post('/api/feedback');
  expect(response.status()).toBeGreaterThanOrEqual(400);
  expect(response.status()).toBeLessThan(500);
});

test('oversized body is rejected', async ({ request }) => {
  const response = await request.post('/api/feedback', { form: { message: 'a'.repeat(20000) } });
  expect(response.status()).toBe(413);
});
