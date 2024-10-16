export function parseToJsonLD({
  product,
  selectedItem,
  currency,
  disableOffers,
  decimals,
  pricesWithTax,
  userSellerDefault,
}: {
  product: unknown
  selectedItem: unknown
  currency: string
  disableOffers: boolean
  decimals: number
  pricesWithTax: boolean
  userSellerDefault?: boolean
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
  gtin: string
  mpn: string
  sku: number
  category: string
  offers: {
    '@type': string
    lowPrice: number
    highPrice: number
    priceCurrency: string
    offers: Array<{
      '@type': string
      seller: {
        '@type': string
        name: string
      }
    }>
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
