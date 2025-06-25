import { getCategoryByTitle, initialCategories, Category } from '../src/data/categories';

describe('getCategoryByTitle', () => {
  test('testGetCategoryByTitle_shouldReturnCategoryForExistingTitle', () => {
    const titleToFind = 'KASY';
    const expectedCategory: Category | undefined = initialCategories.find(
      (cat: Category) => cat.title === titleToFind
    );

    const result = getCategoryByTitle(titleToFind);

    expect(result).toBeDefined();
    expect(result).toEqual(expectedCategory);
    expect(result?.title).toBe(titleToFind);
  });
});