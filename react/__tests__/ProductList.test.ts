import { getProductList } from '../ProductList'
import { createProductList } from '../__fixtures__/productListMock'

describe('Product List Structured Data', () => {
  beforeEach(() => {
    global.__RUNTIME__ = {}
    global.__hostname__ = 'testSuite.com'
  })

  it('Should create a list', () => {
    const products = createProductList()
    const productListLD = getProductList(products)

    expect(productListLD['@type']).toBe('ItemList')
    expect(productListLD.itemListElement).toHaveLength(2)
    expect(productListLD.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: products[0].productName,
      url: `https://testSuite.com/${
        products[0].link ?? products[0].linkText
      }/p`,
    })
    expect(productListLD.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: products[1].productName,
      url: `https://testSuite.com/${
        products[1].link ?? products[1].linkText
      }/p`,
    })
  })

  it('Handles empty case', () => {
    const products = []
    const productListLD = getProductList(products)

    expect(productListLD.itemListElement).toHaveLength(0)
  })

  it('Handles undefined case', () => {
    const products = undefined
    const productListLD = getProductList(products)

    expect(productListLD).toBeNull()
  })
})

describe('double slash on product URLs', () => {
  describe('when the baseURL has a trailing slash', () => {
    beforeEach(() => {
      global.__RUNTIME__ = {}
      global.__hostname__ = 'testSuite.com/'
    })
  
    it('does not create URLs with double slash', () => {
      const products = createProductList()
      const productListLD = getProductList(products)
  
      expect(productListLD.itemListElement[0].url).toEqual(
        `https://testSuite.com/${
          products[0].link ?? products[0].linkText
        }/p`,
      )
      expect(productListLD.itemListElement[1].url).toEqual(
        `https://testSuite.com/${
          products[1].link ?? products[1].linkText
        }/p`,
      )
    })
  })

  describe('when the product link has an opening slash', () => {
    it('does not create URLs with double /', () => {
      const products = createProductList()
      products[0].linkText = '/blouse'
      products[1].link = '/skirt/p'
      const productListLD = getProductList(products)
  
      expect(productListLD.itemListElement[0].url).toEqual(
        `https://testSuite.com/blouse/p`,
      )
      expect(productListLD.itemListElement[1].url).toEqual(
        `https://testSuite.com/skirt/p`,
      )
    })
  })

  describe('when both the baseURL and the product link have opening slashes', () => {
    beforeEach(() => {
      global.__RUNTIME__ = {}
      global.__hostname__ = 'testSuite.com/'
    })
    
    it('does not create URLs with double /', () => {
      const products = createProductList()
      products[0].linkText = '/blouse'
      products[1].link = '/skirt/p'
      const productListLD = getProductList(products)
  
      expect(productListLD.itemListElement[0].url).toEqual(
        `https://testSuite.com/blouse/p`,
      )
      expect(productListLD.itemListElement[1].url).toEqual(
        `https://testSuite.com/skirt/p`,
      )
    })
  })
})