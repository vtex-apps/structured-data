/* eslint-disable react/jsx-filename-extension */
import React, { memo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-restricted-imports
import { pathOr, path, sort, last, flatten } from 'ramda'

const getSpotPrice = path(['commertialOffer', 'spotPrice'])
const getPrice = path(['commertialOffer', 'Price'])
const getAvailableQuantity = pathOr(0, ['commertialOffer', 'AvailableQuantity'])

const sortByPriceAsc = sort(
  (itemA, itemB) => getSpotPrice(itemA) - getSpotPrice(itemB)
)

const isSkuAvailable = (sku) => getAvailableQuantity(sku) > 0

const lowHighForSellers = (sellers) => {
  const sortedByPrice = sortByPriceAsc(sellers)
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

const parseSKUToOffer = (item, currency) => {
  const { low: seller } = lowHighForSellers(item.sellers)

  const availability = getSKUAvailabilityString(seller)
  const price = getSpotPrice(seller)

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

const composeAggregateOffer = (product, currency) => {
  const items = product.items || []

  const allSellers = getAllSellers(items)
  const { low, high } = lowHighForSellers(allSellers)

  const offersList = items
    .map((element) => parseSKUToOffer(element, currency))
    .filter(Boolean)

  if (offersList.length === 0) {
    return null
  }

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: getSpotPrice(low),
    highPrice: getPrice(high),
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

export const parseToJsonLD = (product, selectedItem, currency) => {
  const [image] = selectedItem.images
  const { brand } = product
  const name = product.productName

  const offers = composeAggregateOffer(product, currency)

  if (offers === null) {
    return null
  }

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
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
    culture: { currency, locale },
  } = useRuntime()

  const productLD = parseToJsonLD(product, selectedItem, currency, locale)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }}
    />
  )
}

StructuredData.propTypes = {
  product: PropTypes.object,
  selectedItem: PropTypes.object,
}

export default memo(StructuredData)
