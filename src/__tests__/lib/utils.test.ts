import {
  formatCurrency,
  truncateText,
  getInitials,
  calculatePagination,
  cn,
} from '@/lib/utils';

// Test 1 & 2 — formatCurrency
describe('formatCurrency', () => {
  it('formats a positive number with ₹ symbol and 2 decimals', () => {
    expect(formatCurrency(100)).toBe('₹100.00');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });
});

// Test 3 & 4 — truncateText
describe('truncateText', () => {
  it('truncates text that exceeds the max length', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('returns text unchanged when within the limit', () => {
    expect(truncateText('Hi', 5)).toBe('Hi');
  });
});

// Test 5 & 6 — getInitials
describe('getInitials', () => {
  it('returns two uppercase initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns a single initial for a one-word name', () => {
    expect(getInitials('John')).toBe('J');
  });
});

// Test 7 — calculatePagination
describe('calculatePagination', () => {
  it('calculates total pages, hasNext, and hasPrev correctly for page 1', () => {
    const result = calculatePagination(100, 1, 10);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });
});

// Test 8 — cn
describe('cn', () => {
  it('merges class names into a single string', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
});
