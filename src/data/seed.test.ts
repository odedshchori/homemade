import { describe, it, expect } from 'vitest';
import seedData from './global_items_seed.json';

describe('Global Items Seed Data', () => {
  it('should be an array of exactly 100 items', () => {
    expect(Array.isArray(seedData)).toBe(true);
    expect(seedData.length).toBe(100);
  });

  it('should adhere to the schema', () => {
    const validCategories = [
      'Vegetables',
      'Fruits',
      'Dairy',
      'Meat/Fish',
      'Grains & Legumes',
      'Spices',
      'Canned Goods'
    ];
    const validUnits = ['Grams', 'Units', 'ml'];

    seedData.forEach((item: any) => {
      expect(item).toHaveProperty('Item_ID');
      expect(typeof item.Item_ID).toBe('string');
      // Validate UUID format roughly
      expect(item.Item_ID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      expect(item).toHaveProperty('Name');
      expect(typeof item.Name).toBe('string');
      expect(item.Name.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('Category_ID');
      expect(validCategories).toContain(item.Category_ID);

      expect(item).toHaveProperty('Default_Unit');
      expect(validUnits).toContain(item.Default_Unit);

      expect(item).toHaveProperty('Expiry_Buffer');
      expect(Number.isInteger(item.Expiry_Buffer)).toBe(true);
      expect(item.Expiry_Buffer).toBeGreaterThanOrEqual(0);
    });
  });
});
