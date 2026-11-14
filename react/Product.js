/* eslint-disable react/jsx-filename-extension */
import React, { memo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-restricted-imports
import { pathOr, path, sort, last, flatten } from 'ramda'
import { jsonLdScriptProps } from 'react-schemaorg'

import useAppSettings from './hooks/useAppSettings'
import { getBaseUrl } from './modules/baseUrl'

const getSpotPrice = path(['commertialOffer', 'spotPrice'])
const getPrice = path(['commertialOffer', 'Price'])
const getTax = path(['commertialOffer', 'Tax'])
const getAvailableQuantity = pathOr(0, ['commertialOffer', 'AvailableQuantity'])

const roundPrice = (value, decimals) =>
  Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals

const getFinalPrice = (value, getPriceFunc, { decimals, pricesWithTax }) => {
  const price = getPriceFunc(value)

  if (price === undefined || price === null) {
    return price
  }

  const finalPrice = pricesWithTax ? price + (getTax(value) || 0) : price

  return Number.isInteger(decimals) && decimals >= 0
    ? roundPrice(finalPrice, decimals)
    : finalPrice
}

const sortByPriceAsc = sort(
  (itemA, itemB) => getSpotPrice(itemA) - getSpotPrice(itemB)
)

const sortByPriceWithTaxAsc = sort(
  (itemA, itemB) =>
    getSpotPrice(itemA) + getTax(itemA) - (getSpotPrice(itemB) + getTax(itemB))
)

const isSkuAvailable = (sku) => getAvailableQuantity(sku) > 0

const lowHighForSellers = (sellers, { pricesWithTax }) => {
  const sortedByPrice = pricesWithTax
    ? sortByPriceWithTaxAsc(sellers)
    : sortByPriceAsc(sellers)

  const withStock = sortedByPrice.filter(isSkuAvailable)

  if (withStock.length === 0) {
    return {
      low: sortedByPrice[0],
      high: last(sortedByPrice),
    }
  }

  return {
    low: withStock[0],
    high: last(withStock),
  }
}

const IN_STOCK = 'http://schema.org/InStock'
const OUT_OF_STOCK = 'http://schema.org/OutOfStock'

const getSKUAvailabilityString = (seller) =>
  isSkuAvailable(seller) ? IN_STOCK : OUT_OF_STOCK

// GS1 check digit validation, valid for GTIN-8, 12, 13 and 14.
export const hasValidCheckDigit = (digits) => {
  const numbers = digits.split('').map(Number)
  const checkDigit = numbers.pop()
  const sum = numbers
    .reverse()
    .reduce((acc, number, index) => acc + number * (index % 2 === 0 ? 3 : 1), 0)

  return (10 - (sum % 10)) % 10 === checkDigit
}

// Returns a GTIN only when the value is a real one. Left-padding is allowed
// because it keeps the check digit of a real GTIN (e.g. UPC-12 to GTIN-13),
// but a padded internal id (e.g. the SKU id `27` -> `00000027`) fails the
// check digit and is discarded instead of being published as a GTIN.
export const normalizeGTIN = (raw) => {
  if (raw === null || raw === undefined) return null
  const digits = String(raw).replace(/\D+/g, '')

  if (!digits || /^0+$/.test(digits)) return null

  const validLengths = [8, 12, 13, 14]

  const normalized = validLengths.includes(digits.length)
    ? digits
    : digits.padStart(validLengths.find((len) => digits.length < len) ?? 0, '0')

  if (!validLengths.includes(normalized.length)) return null

  return hasValidCheckDigit(normalized) ? normalized : null
}

const getOfferSeller = (sellers, { pricesWithTax, useSellerDefault }) => {
  const defaultSeller = useSellerDefault ? getSellerDefault(sellers) : null

  return defaultSeller ?? lowHighForSellers(sellers, { pricesWithTax }).low
}

const parseSKUToOffer = (
  item,
  currency,
  { decimals, pricesWithTax, useSellerDefault, gtinValue }
) => {
  const seller = getOfferSeller(item.sellers, {
    pricesWithTax,
    useSellerDefault,
  })

  const availability = getSKUAvailabilityString(seller)
  const price = getFinalPrice(seller, getSpotPrice, { decimals, pricesWithTax })

  // When a product is not available the API can't define its price and returns zero.
  // If we set structured data product price as zero, Google will show that the
  // product it's free (wrong info), but out of stock.
  // It's better just not return any offer in that case.
  if (availability === OUT_OF_STOCK && price === 0) {
    return null
  }

  const rawSkuValue = item?.[gtinValue]
  const normalizedGtin = normalizeGTIN(rawSkuValue)
  const offerSku = normalizedGtin || item.itemId

  const offer = {
    '@type': 'Offer',
    price,
    priceCurrency: currency,
    availability,
    sku: offerSku,
    itemCondition: 'http://schema.org/NewCondition',
    priceValidUntil: path(['commertialOffer', 'PriceValidUntil'], seller),
    seller: {
      '@type': 'Organization',
      name: seller ? seller.sellerName : '',
    },
  }

  return offer
}

const getAllSellers = (items) => {
  const allSellers = items.map((item) => item.sellers)
  const flat = flatten(allSellers)

  return flat
}

const getSellerDefault = (sellers = []) => {
  const seller = sellers.find((s) => s.sellerDefault)

  return seller
}

const composeAggregateOffer = (
  product,
  currency,
  {
    decimals,
    pricesWithTax,
    useSellerDefault,
    disableAggregateOffer,
    gtinValue,
  }
) => {
  const items = product.items || []
  const allSellers = getAllSellers(items)
  const { low, high } = lowHighForSellers(allSellers, { pricesWithTax })

  const offersList = items
    .map((element) =>
      parseSKUToOffer(element, currency, {
        decimals,
        pricesWithTax,
        useSellerDefault,
        gtinValue,
      })
    )
    .filter(Boolean)

  if (offersList.length === 0) {
    return null
  }

  if (disableAggregateOffer) {
    return offersList
  }

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: getFinalPrice(low, getSpotPrice, { decimals, pricesWithTax }),
    highPrice: getFinalPrice(high, getPrice, { decimals, pricesWithTax }),
    priceCurrency: currency,
    offers: offersList,
    offerCount: offersList.length,
  }

  return aggregateOffer
}

const getCategoryName = (product) =>
  product.categoryTree &&
  product.categoryTree.length > 0 &&
  product.categoryTree[product.categoryTree.length - 1].name

function parseBrand(brand) {
  const name = typeof brand === 'string' ? brand : brand?.name

  if (!name) {
    return undefined
  }

  return {
    '@type': 'Brand',
    name,
  }
}

export const parseToJsonLD = ({
  product,
  selectedItem,
  currency,
  disableOffers,
  decimals,
  pricesWithTax,
  useSellerDefault,
  useImagesArray,
  disableAggregateOffer,
  gtinValue,
}) => {
  const images = selectedItem ? selectedItem.images : []
  const { brand } = product
  const name = product.productName

  const mpn =
    selectedItem?.referenceId?.[0]?.Value ||
    product?.productReference ||
    product?.productId

  // When offers are disabled the Product markup is still valid without them,
  // so an unavailable product must not remove the whole JSON-LD.
  const offers = disableOffers
    ? null
    : composeAggregateOffer(product, currency, {
        decimals,
        pricesWithTax,
        useSellerDefault,
        disableAggregateOffer,
        gtinValue,
      })

  if (!disableOffers && offers === null) {
    return null
  }

  const baseUrl = getBaseUrl()
  const category = getCategoryName(product)

  const rawGTIN = selectedItem?.[gtinValue]
  const gtin = normalizeGTIN(rawGTIN)

  const merchantSKU = gtin || selectedItem?.itemId || null

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': `${baseUrl}/${product.linkText}/p`,
    name,
    brand: parseBrand(brand),
    image: useImagesArray
      ? images.map((el) => el.imageUrl)
      : images[0]?.imageUrl || null,
    description: product.metaTagDescription || product.description,
    mpn,
    sku: merchantSKU,
    category,
    offers,
    gtin,
  }

  return productLD
}

function StructuredData({ product, selectedItem }) {
  const {
    culture: { currency },
  } = useRuntime()

  const {
    decimals,
    disableOffers,
    disableProductStructuredData,
    pricesWithTax,
    useSellerDefault,
    useImagesArray,
    disableAggregateOffer,
    gtinValue,
  } = useAppSettings()

  if (disableProductStructuredData) return null

  const productLD = parseToJsonLD({
    product,
    selectedItem,
    currency,
    disableOffers,
    decimals,
    pricesWithTax,
    useSellerDefault,
    useImagesArray,
    disableAggregateOffer,
    gtinValue,
  })

  if (!productLD) return null

  return <script {...jsonLdScriptProps(productLD)} />
}

StructuredData.propTypes = {
  product: PropTypes.object,
  selectedItem: PropTypes.object,
}

export default memo(StructuredData)
