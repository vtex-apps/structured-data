import { getProductList } from '../ProductList'
import { createProductList } from '../__fixtures__/productListMock'

const disableOffers = false
const decimals = 2
const pricesWithTax = false
const currency = 'USD'

describe('Product List Structured Data', () => {
  beforeEach(() => {
    global.__RUNTIME__ = {}
    global.__hostname__ = 'testSuite.com'
  })

  it('Should create a list', () => {
    const products = createProductList()

    const productListLD = getProductList({
      products,
      decimals,
      disableOffers,
      pricesWithTax,
      currency,
    })

    expect(productListLD['@type']).toBe('ItemList')
    expect(productListLD.itemListElement).toHaveLength(2)
    expect(productListLD.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      item: {
        '@context': 'https://schema.org/',
        name: products[0].productName,
        '@id': `https://testSuite.com/${
          products[0].link || products[0].linkText
        }/p`,
        '@type': 'Product',
        brand: {
          '@type': 'Brand',
          name: products[0].brand,
        },
        description: products[0].description,
        gtin: null,
        category:
          products[0].categoryTree[products[0].categoryTree.length - 1].name,
        image: products[0].items[0].images[0].imageUrl,
        mpn: products[0].productId,
        sku: products[0].items[0].itemId,
        offers: {
          '@type': 'AggregateOffer',
          highPrice: 100,
          lowPrice: 100,
          offerCount: 1,
          offers: [
            {
              '@type': 'Offer',
              availability: 'http://schema.org/InStock',
              itemCondition: 'http://schema.org/NewCondition',
              price: 100,
              priceCurrency: currency,
              priceValidUntil: undefined,
              seller: {
                '@type': 'Organization',
                name: 'Store Name',
              },
              sku: products[0].items[0].itemId,
            },
          ],
          priceCurrency: currency,
        },
      },
    })
    expect(productListLD.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      item: {
        '@context': 'https://schema.org/',
        name: products[1].productName,
        '@id': `https://testSuite.com/${
          products[1].link || products[1].linkText
        }/p`,
        '@type': 'Product',
        brand: {
          '@type': 'Brand',
          name: products[1].brand,
        },
        description: products[1].description,
        gtin: null,
        category:
          products[1].categoryTree[products[1].categoryTree.length - 1].name,
        image: products[1].items[0].images[0].imageUrl,
        mpn: products[1].productId,
        sku: products[1].items[0].itemId,
        offers: {
          '@type': 'AggregateOffer',
          highPrice: 100,
          lowPrice: 100,
          offerCount: 1,
          offers: [
            {
              '@type': 'Offer',
              availability: 'http://schema.org/InStock',
              itemCondition: 'http://schema.org/NewCondition',
              price: 100,
              priceCurrency: currency,
              priceValidUntil: undefined,
              seller: {
                '@type': 'Organization',
                name: 'Store Name',
              },
              sku: products[1].items[0].itemId,
            },
          ],
          priceCurrency: currency,
        },
      },
    })
  })

  it('Handles empty case', () => {
    const products = []
    const productListLD = getProductList({
      products,
      decimals,
      disableOffers,
      pricesWithTax,
      currency,
    })

    expect(productListLD.itemListElement).toHaveLength(0)
  })

  it('Handles undefined case', () => {
    const products = undefined
    const productListLD = getProductList({
      products,
      decimals,
      disableOffers,
      pricesWithTax,
      currency,
    })

    expect(productListLD).toBeNull()
  })

  it('should not fill offers if disableOffers is true', () => {
    const products = createProductList()

    const productListLD = getProductList({
      products,
      decimals,
      disableOffers: true,
      pricesWithTax,
      currency,
    })

    expect(productListLD['@type']).toBe('ItemList')
    expect(productListLD.itemListElement).toHaveLength(2)
    expect(productListLD.itemListElement[0].item.offers).toBeNull()
  })
})
