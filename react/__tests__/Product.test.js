import { clone } from 'ramda'

import { parseToJsonLD } from '../Product'
import { createProduct, createItem } from '../__fixtures__/productMock'
import { product as mktPlaceProduct } from '../__fixtures__/marketplaceProductMock'

const currency = 'BRL'
const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false

describe('Product Structured Data', () => {
  it('should fill low and high prices', () => {
    const product = createProduct()
    const cheapItem = createItem({ id: '2', price: 45, quantity: 1 })
    const expensiveItem = createItem({ id: '3', price: 60, quantity: 2 })

    product.items.push(cheapItem)
    product.items.push(expensiveItem)

    const result = parseToJsonLD(product, product.items[0], currency, DEFAULT_DECIMALS, DEFAULT_PRICES_WITH_TAX)

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

    const result = parseToJsonLD(product, product.items[0], currency, DEFAULT_DECIMALS, DEFAULT_PRICES_WITH_TAX)

    expect(result.offers.lowPrice).toBe(40)
    expect(result.offers.highPrice).toBe(45)
  })

  it('should handle many skus availability', () => {
    const product = createProduct()
    const unavailableItem = createItem({ id: '2', price: 0, quantity: 0 })
    const availableItem = createItem({ id: '3', price: 60, quantity: 1 })

    product.items.push(unavailableItem)
    product.items.push(availableItem)

    const result = parseToJsonLD(product, product.items[0], currency)

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

    const resultOneSku = parseToJsonLD(
      productOneSku,
      productOneSku.items[0],
      currency,
      DEFAULT_DECIMALS,
      DEFAULT_PRICES_WITH_TAX
    )

    const resultTwoSkus = parseToJsonLD(
      productTwoSkus,
      productTwoSkus.items[0],
      currency,
      DEFAULT_DECIMALS,
      DEFAULT_PRICES_WITH_TAX
    )

    expect(resultOneSku).toBeNull()
    expect(resultTwoSkus).toBeNull()
  })

  it('should handle multiple sellers correctly, get correct low price and high price', () => {
    const result = parseToJsonLD(
      mktPlaceProduct,
      mktPlaceProduct.items[0],
      currency,
      DEFAULT_DECIMALS,
      DEFAULT_PRICES_WITH_TAX
    )

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

    const result = parseToJsonLD(copyProduct, copyProduct.items[0], currency, DEFAULT_DECIMALS, DEFAULT_PRICES_WITH_TAX)

    expect(result.offers.lowPrice).toBe(1000)
    expect(result.offers.highPrice).toBe(955900)
    expect(result.offers.offerCount).toBe(2)
    expect(result.offers.offers[0].price).toBe(869900)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
    expect(result.offers.offers[1].price).toBe(1000)
    expect(result.offers.offers[1].seller.name).toBe(item.sellers[2].sellerName)
  })
})
