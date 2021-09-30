import React from 'react'
import { jsonLdScriptProps } from 'react-schemaorg'
import { ItemList, WithContext, ListItem } from 'schema-dts'

import { getBaseUrl } from './modules/baseUrl'

interface Product {
  productName: string
  linkText: string
  link: string
}

interface Props {
  products?: Product[]
}

export function getProductList(products?: Product[]) {
  if (!Array.isArray(products)) {
    return null
  }

  const baseUrl = getBaseUrl()

  const productItems: ListItem[] = products.map((product, index) => {
    const productUrl = `${baseUrl}/${product.link ?? `${product.linkText}/p`}`
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: product.productName,
      url: productUrl,
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productItems,
  } as WithContext<ItemList>
}

function ProductList({ products }: Props) {
  const productListLD: WithContext<ItemList> | null = getProductList(products)

  if (!productListLD) {
    return null
  }

  return <script {...jsonLdScriptProps<ItemList>(productListLD)} />
}

export default ProductList
