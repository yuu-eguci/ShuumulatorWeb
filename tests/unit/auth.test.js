import { describe, expect, test } from 'vitest';
import { userIdFromToken } from '@/auth';
import { fakeJwt } from './mockApi';

describe('userIdFromToken', () => {
  test('reads user_id from the JWT payload', () => {
    expect(userIdFromToken(fakeJwt(42))).toBe(42);
  });

  test.each([undefined, '', 'not-a-jwt', 'a.b.c', `x.${Buffer.from('{"user_id":"1;"}').toString('base64url')}.y`])(
    'returns null for unusable token %s',
    (token) => {
      expect(userIdFromToken(token)).toBeNull();
    },
  );
});
