export function parseToJsonLD({
  product,
  selectedItem,
  currency,
  decimals,
  pricesWithTax,
}: {
  product: any
  selectedItem: any
  currency: any
  decimals: any
  pricesWithTax: any
}): {
  '@context': string
  '@type': string
  '@id': string
  name: any
  brand: {
    '@type': string
    name: any
  }
  image: any
  description: any
  mpn: any
  sku: any
  category: any
  offers: {
    '@type': string
    lowPrice: any
    highPrice: any
    priceCurrency: any
    offers: any
    offerCount: any
  }
}

declare const _default: import('react').MemoExoticComponent<typeof StructuredData>

export default _default

declare function StructuredData({
  product,
  selectedItem,
}: {
  product: any
  selectedItem: any
}): JSX.Element

declare namespace StructuredData {
  namespace propTypes {
    const product: any
    const selectedItem: any
  }
}
