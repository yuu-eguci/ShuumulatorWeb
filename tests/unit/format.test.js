import { describe, expect, test } from 'vitest';
import { formatYen, formatSignedYen, priceTrendClass } from '@/format';

describe('formatYen', () => {
  test('adds thousands separators', () => {
    expect(formatYen(1234567)).toBe('1,234,567');
  });
});

describe('formatSignedYen', () => {
  test('profit gets a single plus sign', () => {
    expect(formatSignedYen(2000)).toBe('+2,000');
  });

  test('loss gets a single minus sign', () => {
    expect(formatSignedYen(-2000)).toBe('-2,000');
  });

  test('floating point noise from (0.1 - 0.3) * 100 is shown as -20', () => {
    expect(formatSignedYen((0.1 - 0.3) * 100)).toBe('-20');
  });
});

describe('priceTrendClass', () => {
  test('compares numbers, not formatted strings (999 -> 1000 is up)', () => {
    expect(priceTrendClass(999, 1000)).toBe('text-danger');
  });

  test('1000 -> 999 is down', () => {
    expect(priceTrendClass(1000, 999)).toBe('text-success');
  });

  test('unchanged price is shown as up, like before', () => {
    expect(priceTrendClass(1500, 1500)).toBe('text-danger');
  });
});
