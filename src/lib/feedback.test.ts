import { expect, test } from 'bun:test';
import { EMAIL_MAX, MESSAGE_MAX, parseFeedback } from './feedback';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

test('rejects missing message', () => {
  expect(parseFeedback(form({})).ok).toBe(false);
});

test('rejects whitespace-only message', () => {
  expect(parseFeedback(form({ message: '   ' })).ok).toBe(false);
});

test('rejects too long message', () => {
  expect(parseFeedback(form({ message: 'a'.repeat(MESSAGE_MAX + 1) })).ok).toBe(false);
});

test('rejects too long email', () => {
  const email = `${'a'.repeat(EMAIL_MAX)}@x.com`;
  expect(parseFeedback(form({ message: 'hi', email })).ok).toBe(false);
});

test('rejects email without @', () => {
  expect(parseFeedback(form({ message: 'hi', email: 'nope' })).ok).toBe(false);
});

test('accepts message without email', () => {
  expect(parseFeedback(form({ message: ' hi ' }))).toEqual({
    ok: true,
    message: 'hi',
    email: null,
  });
});

test('accepts message with email', () => {
  expect(parseFeedback(form({ message: 'hi', email: 'a@b.c' }))).toEqual({
    ok: true,
    message: 'hi',
    email: 'a@b.c',
  });
});
