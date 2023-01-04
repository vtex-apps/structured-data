import React from 'react'
import { jsonLdScriptProps } from 'react-schemaorg'
import { ItemList, WithContext, ListItem } from 'schema-dts'
import { useRuntime } from 'vtex.render-runtime'

import useAppSettings from './hooks/useAppSettings'
import { parseToJsonLD } from './Product'

interface Product {
  productName: string
  linkText: string
  link: string
  items: unknown[]
}

interface Props {
  products?: Product[]
}

export function getProductList({
  decimals,
  pricesWithTax,
  pricesHidden,
  currency,
  products,
}: {
  decimals: number
  pricesWithTax: boolean
  pricesHidden: boolean
  currency: string
  products?: Product[]
}) {
  if (!Array.isArray(products)) {
    return null
  }

  const productItems: ListItem[] = products.map((product, index) => {
    const [selectedItem] = product.items
    const item = parseToJsonLD({
      product,
      selectedItem,
      currency,
      decimals,
      pricesWithTax,
      pricesHidden,
    })

    return {
      '@type': 'ListItem',
      position: index + 1,
      ...(item && { item }),
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productItems,
  } as WithContext<ItemList>
}

function ProductList({ products }: Props) {
  const {
    culture: { currency },
  } = useRuntime()

  const { decimals, pricesWithTax, pricesHidden } = useAppSettings()
  const productListLD: WithContext<ItemList> | null = getProductList({
    decimals,
    pricesWithTax,
    pricesHidden,
    currency,
    products,
  })

  if (!productListLD) {
    return null
  }

  return <script {...jsonLdScriptProps<ItemList>(productListLD)} />
}

export default ProductList
