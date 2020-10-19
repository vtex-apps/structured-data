export const createProductList = () => {
  return [
    {
      cacheId: 'blouse',
      productName: 'Blouse',
      productId: '1',
      description: 'Product Description',
      titleTag: 'Product Name',
      metaTagDescription: null,
      linkText: 'blouse',
      categories: [
        '/Category A/',
        '/Category A/Category B/',
        '/Category A/Category B/Category C/',
      ],
      categoryId: '1',
      categoriesIds: ['/1/2/3/', '/1/2/', '/1/'],
      brand: 'Brand',
      categoryTree: [
        { id: '1', name: 'Category A', href: 'category-a' },
        { id: '2', name: 'Category B', href: 'category-a/category-b' },
        { 
          id: '3',
          name: 'Category C',
          href: 'category-a/category-b/category-c'
        },
      ],
      items: [],
    },
    {
      cacheId: 'skirt',
      productName: 'Skirt',
      productId: '2',
      description: 'Product Description',
      titleTag: 'Product Name',
      metaTagDescription: null,
      linkText: 'skirt',
      categories: [
        '/Category A/',
        '/Category A/Category B/',
        '/Category A/Category B/Category C/',
      ],
      categoryId: '1',
      categoriesIds: ['/1/2/3/', '/1/2/', '/1/'],
      brand: 'Brand',
      categoryTree: [
        { id: '1', name: 'Category A', href: 'category-a' },
        { id: '2', name: 'Category B', href: 'category-a/category-b' },
        { id: '3', name: 'Category C', href: 'category-a/category-b/category-c' },
      ],
      items: [],
    },
  ]
}
