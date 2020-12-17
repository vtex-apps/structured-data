import React, { FC } from 'react'
import { jsonLdScriptProps } from 'react-schemaorg'
import { ItemList, ListItem } from 'schema-dts'

import { getBaseUrl } from './modules/baseUrl'

interface Product {
  productName: string
  linkText: string
}

interface Props {
  products?: Product[]
}

export const getProductList = (products?: Product[]) => {
  if (!Array.isArray(products)) {
    return null
  }

  const baseUrl = getBaseUrl()

  const productItems: ListItem[] = products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: product.productName,
    url: `${baseUrl}/${product.linkText}`,
  }))

  return jsonLdScriptProps<ItemList>({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productItems,
  })
}

const ProductBreadcrumbStructuredData: FC<Props> = ({ products }) => {
  const productListLD = getProductList(products)

  if (!productListLD) {
    return null
  }

  return <script {...productListLD} />
}

export default ProductBreadcrumbStructuredData
