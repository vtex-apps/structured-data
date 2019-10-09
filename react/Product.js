import React, { memo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { pathOr, path, sort, last, flatten } from 'ramda'

const getPrice = path(['commertialOffer', 'Price'])
const getAvailableQuantity = pathOr(0, ['commertialOffer', 'AvailableQuantity'])

const sortByPriceAsc = sort((itemA, itemB) => getPrice(itemA) - getPrice(itemB))

const isSkuAvailable = sku => getAvailableQuantity(sku) > 0

const lowHighForSellers = sellers => {
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

const getSKUAvailabilityString = seller =>
  isSkuAvailable(seller)
    ? 'http://schema.org/InStock'
    : 'http://schema.org/OutOfStock'

const parseSKUToOffer = (item, currency) => {
  const { low: seller } = lowHighForSellers(item.sellers)

  const availability = getSKUAvailabilityString(seller)
  const price = getPrice(seller)

  // When a product is not available the API can't define its price and returns zero.
  // If we set structured data product price as zero, Google will show that the
  // product it's free (wrong info), but out of stock.
  // It's better just not return any offer in that case.
  if (availability === 'http://schema.org/OutOfStock' && price === 0) {
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

const getAllSellers = items => {
  const allSellers = items.map(i => i.sellers)
  const flat = flatten(allSellers)
  return flat
}

const composeAggregateOffer = (product, currency) => {
  const items = product.items || []

  const allSellers = getAllSellers(items)
  const { low, high } = lowHighForSellers(allSellers)

  const offersList = items
    .map(element => parseSKUToOffer(element, currency))
    .filter(Boolean)

  if (offersList.length === 0) {
    return undefined
  }

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: getPrice(low),
    highPrice: getPrice(high),
    priceCurrency: currency,
    offers: offersList,
    offerCount: items.length,
  }

  return aggregateOffer
}

const getCategoryName = product =>
  product.categoryTree[product.categoryTree.length - 1].name

export const parseToJsonLD = (product, selectedItem, currency) => {
  const image = selectedItem.images[0]
  const brand = product.brand
  const name = product.productName

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    brand: brand,
    image: image && image.imageUrl,
    description: product.metaTagDescription,
    mpn: product.productId,
    sku: selectedItem.itemId,
    category:
      product.categoryTree &&
      product.categoryTree.length > 0 &&
      getCategoryName(product),
    offers: composeAggregateOffer(product, currency),
  }

  return productLD
}

function StructuredData({ product, selectedItem }) {
  const {
    culture: { currency, locale },
  } = useRuntime()
  const productLD = parseToJsonLD(product, selectedItem, currency, locale)

  return <script type="application/ld+json">{JSON.stringify(productLD)}</script>
}

StructuredData.propTypes = {
  product: PropTypes.object,
  selectedItem: PropTypes.object,
}

export default memo(StructuredData)
