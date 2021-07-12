/* eslint-disable react/jsx-filename-extension */
import React, { memo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-restricted-imports
import { pathOr, path, sort, last, flatten } from 'ramda'
import { jsonLdScriptProps } from 'react-schemaorg'
import { useQuery } from 'react-apollo'

import GET_SETTINGS from './queries/getSettings.graphql'

const getSpotPrice = path(['commertialOffer', 'spotPrice'])
const getPrice = path(['commertialOffer', 'Price'])
const getTax = path(['commertialOffer', 'Tax'])
const getAvailableQuantity = pathOr(0, ['commertialOffer', 'AvailableQuantity'])
const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false

const AppSettings = () => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })

  if (!data) {
    return {
      decimals: DEFAULT_DECIMALS,
      pricesWithTax: DEFAULT_PRICES_WITH_TAX,
    }
  }

  const { decimals, pricesWithTax } = JSON.parse(data.appSettings.message)

  return {
    decimals,
    pricesWithTax,
  }
}

const getFinalPrice = (value, getPriceFunc, { decimals, pricesWithTax }) => {
  return pricesWithTax
    ? Math.round(
        (getPriceFunc(value) + getTax(value) + Number.EPSILON) * 10 ** decimals
      ) /
        10 ** decimals
    : getPriceFunc(value)
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

const parseSKUToOffer = (item, currency, { decimals, pricesWithTax }) => {
  const { low: seller } = lowHighForSellers(item.sellers, { pricesWithTax })

  const availability = getSKUAvailabilityString(seller)

  const price = getFinalPrice(seller, getSpotPrice, { decimals, pricesWithTax })

  // When a product is not available the API can't define its price and returns zero.
  // If we set structured data product price as zero, Google will show that the
  // product it's free (wrong info), but out of stock.
  // It's better just not return any offer in that case.
  if (availability === OUT_OF_STOCK && price === 0) {
    return null
  }

  const offer = {
    '@type': 'Offer',
    price,
    priceCurrency: currency,
    availability: getSKUAvailabilityString(seller),
    sku: item.itemId,
    itemCondition: 'http://schema.org/NewCondition',
    priceValidUntil: path(['commertialOffer', 'PriceValidUntil'], seller),
    seller: {
      '@type': 'Organization',
      name: seller.sellerName,
    },
  }

  return offer
}

const getAllSellers = (items) => {
  const allSellers = items.map((item) => item.sellers)
  const flat = flatten(allSellers)

  return flat
}

const composeAggregateOffer = (
  product,
  currency,
  { decimals, pricesWithTax }
) => {
  const items = product.items || []
  const allSellers = getAllSellers(items)
  const { low, high } = lowHighForSellers(allSellers, { pricesWithTax })

  const offersList = items
    .map((element) =>
      parseSKUToOffer(element, currency, { decimals, pricesWithTax })
    )
    .filter(Boolean)

  if (offersList.length === 0) {
    return null
  }

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: getFinalPrice(low, getSpotPrice, { decimals, pricesWithTax }),
    highPrice: getFinalPrice(high, getPrice, { decimals, pricesWithTax }),
    priceCurrency: currency,
    offers: offersList,
    offerCount: items.length,
  }

  return aggregateOffer
}

const getCategoryName = (product) =>
  product.categoryTree &&
  product.categoryTree.length > 0 &&
  product.categoryTree[product.categoryTree.length - 1].name

export const parseToJsonLD = ({
  product,
  selectedItem,
  currency,
  decimals,
  pricesWithTax,
}) => {
  const [image] = selectedItem.images
  const { brand } = product
  const name = product.productName

  const offers = composeAggregateOffer(product, currency, {
    decimals,
    pricesWithTax,
  })

  if (offers === null) {
    return null
  }

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': product.link,
    name,
    brand,
    image: image && image.imageUrl,
    description: product.metaTagDescription,
    mpn: product.productId,
    sku: selectedItem.itemId,
    category: getCategoryName(product),
    offers,
  }

  return productLD
}

function StructuredData({ product, selectedItem }) {
  const {
    culture: { currency },
  } = useRuntime()

  const { decimals, pricesWithTax } = AppSettings()

  const productLD = parseToJsonLD({
    product,
    selectedItem,
    currency,
    decimals,
    pricesWithTax,
  })

  return <script {...jsonLdScriptProps(productLD)} />
}

StructuredData.propTypes = {
  product: PropTypes.object,
  selectedItem: PropTypes.object,
}

export default memo(StructuredData)
