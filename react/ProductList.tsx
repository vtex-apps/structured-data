import React, { FC } from 'react'
import { Product } from 'vtex.catalog-graphql'

import { getBaseUrl } from './modules/baseUrl'
import { ProductList } from './modules/productList'

export const getProductList = (products?: Product): ProductList | {} => {
  if (!Array.isArray(products)) {
    return {}
  }

  const baseUrl = getBaseUrl()

  const productItems = products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: product.productName,
    url: `${baseUrl}/${product.linkText}`,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productItems,
  }
}

interface Props {
  products?: Product
}

const ProductBreadcrumbStructuredData: FC<Props> = ({ products }) => {
  const productListLD = getProductList(products)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productListLD) }}
    />
  )
}

export default ProductBreadcrumbStructuredData
