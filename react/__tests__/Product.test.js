import { clone } from 'ramda'

import { parseToJsonLD } from '../Product'
import { createProduct, createItem } from '../__fixtures__/productMock'
import { product as mktPlaceProduct } from '../__fixtures__/marketplaceProductMock'
import * as getBaseUrl from '../modules/baseUrl'

let mockDisableOffers = false
let mockDecimals = 2
let mockPricesWithTax = false
let mockGetBaseUrl
const mockedBaseUrl = `www.vtex.com.br`

const currency = 'BRL'

describe('Product Structured Data', () => {
  beforeAll(() => {
    mockGetBaseUrl = jest
      .spyOn(getBaseUrl, 'getBaseUrl')
      .mockReturnValue(mockedBaseUrl)
  })

  afterAll(() => {
    mockGetBaseUrl.mockRestore()
  })

  it('should fill low and high prices', () => {
    const product = createProduct()
    const cheapItem = createItem({ id: '2', price: 45, quantity: 1 })
    const expensiveItem = createItem({ id: '3', price: 60, quantity: 2 })

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    product.items.push(cheapItem)
    product.items.push(expensiveItem)

    const result = parseToJsonLD({
      product,
      selectedItem: product.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(45)
    expect(result.offers.highPrice).toBe(60)
    expect(result.offers.priceCurrency).toBe(currency)
    expect(result.sku).toBe(cheapItem.itemId)
    expect(result.category).toBe('Category C')
  })

  it('should use spotPrice as lowPrice', () => {
    const product = createProduct()
    const cheapItem = createItem({
      id: '2',
      spotPrice: 40,
      price: 45,
      quantity: 1,
    })

    product.items.push(cheapItem)

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    const result = parseToJsonLD({
      product,
      selectedItem: product.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(40)
    expect(result.offers.highPrice).toBe(45)
  })

  it('should handle many skus availability', () => {
    const product = createProduct()
    const unavailableItem = createItem({ id: '2', price: 0, quantity: 0 })
    const availableItem = createItem({ id: '3', price: 60, quantity: 1 })

    product.items.push(unavailableItem)
    product.items.push(availableItem)

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    const result = parseToJsonLD({
      product,
      selectedItem: product.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(60)
    expect(result.offers.highPrice).toBe(60)
    expect(result.offers.priceCurrency).toBe(currency)
    expect(result.offers.offers).toHaveLength(1)
    expect(result.offers.offers[0].availability).toBe(
      'http://schema.org/InStock'
    )
  })

  it('should handle product that have only skus that are unavailable', () => {
    const productOneSku = createProduct()
    const unavailableItem = createItem({ id: '1', price: 0, quantity: 0 })

    productOneSku.items.push(unavailableItem)

    const productTwoSkus = createProduct()

    productTwoSkus.items.push(unavailableItem)
    productTwoSkus.items.push(unavailableItem)

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    const resultOneSku = parseToJsonLD({
      product: productOneSku,
      selectedItem: productOneSku.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    const resultTwoSkus = parseToJsonLD({
      product: productTwoSkus,
      selectedItem: productTwoSkus.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(resultOneSku).toBeNull()
    expect(resultTwoSkus).toBeNull()
  })

  it('should handle multiple sellers correctly, get correct low price and high price', () => {
    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    const result = parseToJsonLD({
      product: mktPlaceProduct,
      selectedItem: mktPlaceProduct.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(869900)
    expect(result.offers.highPrice).toBe(955900)
    expect(result.offers.offerCount).toBe(1)
    expect(result.offers.offers[0].price).toBe(869900)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
  })

  it('should handle multiple sellers and multiple items correctly, get correct low price and high price', () => {
    const copyProduct = clone(mktPlaceProduct)
    const item = clone(copyProduct.items[0])

    item.sellers[2].commertialOffer.spotPrice = 1000
    copyProduct.items.push(item)

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = false

    const result = parseToJsonLD({
      product: copyProduct,
      selectedItem: copyProduct.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(1000)
    expect(result.offers.highPrice).toBe(955900)
    expect(result.offers.offerCount).toBe(2)
    expect(result.offers.offers[0].price).toBe(869900)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
    expect(result.offers.offers[1].price).toBe(1000)
    expect(result.offers.offers[1].seller.name).toBe(item.sellers[2].sellerName)
  })

  it('should handle multiple sellers and multiple items correctly, get correct low price and high price for prices with tax', () => {
    const copyProduct = clone(mktPlaceProduct)
    const item = clone(copyProduct.items[0])

    item.sellers[2].commertialOffer.spotPrice = 1000
    copyProduct.items.push(item)

    mockDisableOffers = false
    mockDecimals = 2
    mockPricesWithTax = true

    const result = parseToJsonLD({
      product: copyProduct,
      selectedItem: copyProduct.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers.lowPrice).toBe(1019)
    expect(result.offers.highPrice).toBe(955919)
    expect(result.offers.offerCount).toBe(2)
    expect(result.offers.offers[0].price).toBe(869919)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
    expect(result.offers.offers[1].price).toBe(1019)
    expect(result.offers.offers[1].seller.name).toBe(item.sellers[2].sellerName)
  })

  it(`should have the product's final production URI as @id`, () => {
    const copyProduct = clone(mktPlaceProduct)

    const result = parseToJsonLD({
      product: copyProduct,
      selectedItem: copyProduct.items[0],
      currency,
    })

    expect(result['@id']).toBe(`${mockedBaseUrl}/${copyProduct.linkText}/p`)
  })

  it('should not fill offers if disableOffers is true', () => {
    const copyProduct = clone(mktPlaceProduct)

    mockDisableOffers = true
    mockDecimals = 2
    mockPricesWithTax = false

    const result = parseToJsonLD({
      product: copyProduct,
      selectedItem: copyProduct.items[0],
      currency,
      disableOffers: mockDisableOffers,
      decimals: mockDecimals,
      pricesWithTax: mockPricesWithTax,
    })

    expect(result.offers).toBeNull()
  })
})
