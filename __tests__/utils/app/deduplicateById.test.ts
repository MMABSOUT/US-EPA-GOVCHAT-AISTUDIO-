import { describe, expect, it } from 'vitest';
import { deduplicateById } from '@/utils/app/importExport';

describe('deduplicateById', () => {
  it('should deduplicate items keeping the first occurrence in O(N) time', () => {
    const items = [
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
      { id: '1', name: 'duplicate' },
      { id: '3', name: 'third' },
      { id: '2', name: 'another-duplicate' },
    ];
    const result = deduplicateById(items);
    expect(result).toEqual([
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
      { id: '3', name: 'third' },
    ]);
  });

  it('should handle empty arrays', () => {
    expect(deduplicateById([])).toEqual([]);
  });

  it('should preserve already unique arrays', () => {
    const items = [
      { id: 'a', val: 1 },
      { id: 'b', val: 2 },
    ];
    expect(deduplicateById(items)).toEqual(items);
  });
});
