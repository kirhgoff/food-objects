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

test('accepts message of exactly MESSAGE_MAX', () => {
  expect(parseFeedback(form({ message: 'a'.repeat(MESSAGE_MAX) })).ok).toBe(true);
});

test('rejects message of MESSAGE_MAX + 1', () => {
  expect(parseFeedback(form({ message: 'a'.repeat(MESSAGE_MAX + 1) })).ok).toBe(false);
});

test('accepts email of exactly EMAIL_MAX', () => {
  const email = `${'a'.repeat(EMAIL_MAX - 2)}@b`;
  expect(parseFeedback(form({ message: 'hi', email })).ok).toBe(true);
});

test('rejects email of EMAIL_MAX + 1', () => {
  const email = `${'a'.repeat(EMAIL_MAX - 1)}@b`;
  expect(parseFeedback(form({ message: 'hi', email })).ok).toBe(false);
});

test('accepts CRLF message of exactly MESSAGE_MAX characters as browsers count them', () => {
  const message = `${'a'.repeat(MESSAGE_MAX - 2)}\r\nb`.slice(0, MESSAGE_MAX + 1);
  expect(parseFeedback(form({ message })).ok).toBe(true);
});

test('rejects a file as message', () => {
  const data = new FormData();
  data.set('message', new File(['x'], 'x.txt'));
  expect(parseFeedback(data)).toEqual({ ok: false, error: 'Message is required' });
});

test('rejects a file as email', () => {
  const data = new FormData();
  data.set('message', 'hi');
  data.set('email', new File(['x'], 'x.txt'));
  expect(parseFeedback(data).ok).toBe(false);
});
