import { Request, Response } from 'express';
import { buildCategoryTree } from '../modules/content/categories.controller';

// Unit tests for category tree building logic
describe('Category Tree Builder', () => {
  it('should build a flat category tree correctly', () => {
    const categories = [
      { id: '1', name: 'Tech', parentId: null },
      { id: '2', name: 'Lifestyle', parentId: null },
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(2);
    expect(tree[0].name).toBe('Tech');
    expect(tree[1].name).toBe('Lifestyle');
  });

  it('should build a hierarchical category tree correctly', () => {
    const categories = [
      { id: '1', name: 'Tech', parentId: null },
      { id: '2', name: 'Programming', parentId: '1' },
      { id: '3', name: 'JavaScript', parentId: '2' },
      { id: '4', name: 'Lifestyle', parentId: null },
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(2);
    expect(tree[0].name).toBe('Tech');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].name).toBe('Programming');
    expect(tree[0].children[0].children[0].name).toBe('JavaScript');
    expect(tree[1].name).toBe('Lifestyle');
    expect(tree[1].children).toHaveLength(0);
  });

  it('should handle empty categories array', () => {
    const tree = buildCategoryTree([]);
    expect(tree).toEqual([]);
  });
});

describe('Tag Validation Logic', () => {
  const validateTagName = (name: any) => {
    if (!name) return { valid: false, error: 'Tag name is required' };
    if (name.trim().length === 0) return { valid: false, error: 'Tag name cannot be empty' };
    if (name.length > 50) return { valid: false, error: 'Tag name must be 50 characters or less' };
    return { valid: true };
  };

  it('should accept valid tag names', () => {
    expect(validateTagName('tech').valid).toBe(true);
    expect(validateTagName('design').valid).toBe(true);
    expect(validateTagName('a'.repeat(50)).valid).toBe(true);
  });

  it('should reject missing tag name', () => {
    const result = validateTagName(undefined);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Tag name is required');
  });

  it('should reject empty tag name', () => {
    const result = validateTagName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Tag name cannot be empty');
  });

  it('should reject overly long tag names', () => {
    const result = validateTagName('a'.repeat(51));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Tag name must be 50 characters or less');
  });
});

describe('Category Validation Logic', () => {
  const validateCategoryName = (name: any) => {
    if (!name) return { valid: false, error: 'Category name is required' };
    if (name.trim().length === 0) return { valid: false, error: 'Category name cannot be empty' };
    return { valid: true };
  };

  it('should accept valid category names', () => {
    expect(validateCategoryName('Technology').valid).toBe(true);
    expect(validateCategoryName('Programming').valid).toBe(true);
  });

  it('should reject missing category name', () => {
    const result = validateCategoryName(undefined);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Category name is required');
  });

  it('should reject empty category name', () => {
    const result = validateCategoryName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Category name cannot be empty');
  });
});
