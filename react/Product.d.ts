export function parseToJsonLD({
  product,
  selectedItem,
  currency,
  decimals,
  pricesWithTax,
  pricesHidden,
}: {
  product: unknown
  selectedItem: unknown
  currency: string
  decimals: number
  pricesWithTax: boolean
  pricesHidden: boolean
}): {
  '@context': string
  '@type': string
  '@id': string
  name: string
  brand: {
    '@type': string
    name: string
  }
  image: string
  description: string
  mpn: string
  sku: number
  category: string
  offers: {
    '@type': string
    lowPrice: number
    highPrice: number
    priceCurrency: string
    offers: unknown
    offerCount: number
  }
}

declare const _default: import('react').MemoExoticComponent<typeof StructuredData>

export default _default

declare function StructuredData({
  product,
  selectedItem,
}: {
  product: unknown
  selectedItem: unknown
}): JSX.Element

declare namespace StructuredData {
  namespace propTypes {
    const product: unknown
    const selectedItem: unknown
  }
}
