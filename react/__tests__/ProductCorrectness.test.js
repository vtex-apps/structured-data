import { parseToJsonLD, normalizeGTIN, hasValidCheckDigit } from '../Product'
import { createProduct, createItem } from '../__fixtures__/productMock'
import * as getBaseUrl from '../modules/baseUrl'

const currency = 'BRL'

const baseArgs = {
  currency,
  disableOffers: false,
  decimals: 2,
  pricesWithTax: false,
}

describe('GTIN normalization', () => {
  it('validates the GS1 check digit', () => {
    expect(hasValidCheckDigit('0736684997502')).toBe(true)
    expect(hasValidCheckDigit('8437009226315')).toBe(true)
    expect(hasValidCheckDigit('0736684997503')).toBe(false)
  })

  it('keeps real GTINs and left-pads them when the check digit stays valid', () => {
    expect(normalizeGTIN('0736684997502')).toBe('0736684997502')
    // UPC-11 without leading zero, padded to UPC-12 keeps a valid check digit
    expect(normalizeGTIN('36000291452')).toBe('036000291452')
  })

  it('does not turn an internal SKU id into a fake GTIN', () => {
    expect(normalizeGTIN('27')).toBeNull()
    expect(normalizeGTIN('177')).toBeNull()
    expect(normalizeGTIN('9854')).toBeNull()
  })

  it('ignores empty, zero and too long values', () => {
    expect(normalizeGTIN(null)).toBeNull()
    expect(normalizeGTIN('')).toBeNull()
    expect(normalizeGTIN('0000')).toBeNull()
    expect(normalizeGTIN('123456789012345')).toBeNull()
  })
})

describe('Product Structured Data correctness', () => {
  let mockGetBaseUrl

  beforeAll(() => {
    mockGetBaseUrl = jest
      .spyOn(getBaseUrl, 'getBaseUrl')
      .mockReturnValue('www.vtex.com.br')
  })

  afterAll(() => {
    mockGetBaseUrl.mockRestore()
  })

  it('uses the EAN as gtin and does not pad the SKU id when gtinValue is itemId', () => {
    const product = createProduct()
    const item = createItem({
      id: '27',
      customFields: { ean: '0736684997502' },
    })

    product.items.push(item)

    const withEan = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: item,
      gtinValue: 'ean',
    })

    expect(withEan.gtin).toBe('0736684997502')
    expect(withEan.sku).toBe('0736684997502')

    const withItemId = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: item,
      gtinValue: 'itemId',
    })

    expect(withItemId.gtin).toBeNull()
    expect(withItemId.sku).toBe('27')
    expect(withItemId.offers.offers[0].sku).toBe('27')
  })

  it('omits gtin when the EAN has an invalid check digit', () => {
    const product = createProduct()
    const item = createItem({ id: '5', customFields: { ean: '1234567' } })

    product.items.push(item)

    const result = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: item,
      gtinValue: 'ean',
    })

    expect(result.gtin).toBeNull()
    expect(result.sku).toBe('5')
  })

  it('offerCount matches the number of published offers', () => {
    const product = createProduct()

    product.items.push(createItem({ id: '1', price: 10 }))
    product.items.push(createItem({ id: '2', price: 0, quantity: 0 }))

    const result = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: product.items[0],
    })

    expect(result.offers.offers).toHaveLength(1)
    expect(result.offers.offerCount).toBe(1)
  })

  it('falls back to the cheapest seller when useSellerDefault has no default seller', () => {
    const product = createProduct()
    const item = createItem({ id: '1', price: 10 })

    item.sellers[0].sellerDefault = false
    product.items.push(item)

    const result = parseToJsonLD({
      ...baseArgs,
      useSellerDefault: true,
      product,
      selectedItem: item,
    })

    expect(result.offers.offers[0].price).toBe(10)
    expect(result.offers.offers[0].availability).toBe(
      'http://schema.org/InStock'
    )
  })

  it('keeps the Product markup for unavailable products when offers are disabled', () => {
    const product = createProduct()
    const item = createItem({ id: '1', price: 0, quantity: 0 })

    product.items.push(item)

    const result = parseToJsonLD({
      ...baseArgs,
      disableOffers: true,
      product,
      selectedItem: item,
    })

    expect(result).not.toBeNull()
    expect(result['@type']).toBe('Product')
    expect(result.offers).toBeNull()
  })

  it('applies the decimals setting even without taxes', () => {
    const product = createProduct()
    const item = createItem({ id: '1', price: 10.005 })

    product.items.push(item)

    const twoDecimals = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: item,
    })

    expect(twoDecimals.offers.offers[0].price).toBe(10.01)

    const noDecimals = parseToJsonLD({
      ...baseArgs,
      decimals: 0,
      product,
      selectedItem: item,
    })

    expect(noDecimals.offers.offers[0].price).toBe(10)
  })

  it('does not crash when the product has no brand', () => {
    const product = createProduct()
    const item = createItem({ id: '1', price: 10 })

    product.brand = undefined
    product.items.push(item)

    const result = parseToJsonLD({
      ...baseArgs,
      product,
      selectedItem: item,
    })

    expect(result.brand).toBeUndefined()
  })
  it('falls back to Price when the seller has no spotPrice', () => {
    const product = createProduct()
    const item = createItem({ id: '5', price: 50 })

    delete item.sellers[0].commertialOffer.spotPrice
    product.items.push(item)

    const result = parseToJsonLD({ ...baseArgs, product, selectedItem: item })

    expect(result.offers.lowPrice).toBe(50)
    expect(result.offers.offers[0].price).toBe(50)
  })
})
