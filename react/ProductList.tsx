import React, { FC } from 'react'

import { getBaseUrl } from './modules/baseUrl'
import { ProductList } from './modules/productList'

interface Product {
  productName: string
  linkText: string
}

interface Props {
  products?: Product[]
}

export const getProductList = (products?: Product[]): ProductList | {} => {
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

const ProductBreadcrumbStructuredData: FC<Props> = ({ products }) => {
  const productListLD = getProductList(products)

  return (
    <script type="application/ld+json">{JSON.stringify(productListLD)}</script>
  )
}

export default ProductBreadcrumbStructuredData
