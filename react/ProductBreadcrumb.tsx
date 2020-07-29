import React, { FC } from 'react'

import { BreadcrumbList } from './modules/breadcrumb'
import { getBaseUrl } from './modules/baseUrl'

interface CategoryTreeItem {
  name: string
  href: string
}

export const productBreadcrumb = (
  categoryTree?: CategoryTreeItem[],
  productName?: string,
  productSlug?: string
): BreadcrumbList | {} => {
  if (!Array.isArray(categoryTree)) {
    return {}
  }

  const baseUrl = getBaseUrl()

  const categoryItems = categoryTree.map((category, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: category.name,
    item: baseUrl + category.href,
  }))

  if (productName && productSlug) {
    categoryItems.push({
      '@type': 'ListItem',
      position: categoryItems.length + 1,
      name: productName,
      item: `${baseUrl}/${productSlug}/p`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: categoryItems,
  }
}

interface Props {
  categoryTree?: CategoryTreeItem[]
  productName?: string
  productSlug?: string
}

const ProductBreadcrumbStructuredData: FC<Props> = ({
  categoryTree,
  productName,
  productSlug,
}) => {
  const breadcrumbLD = productBreadcrumb(categoryTree, productName, productSlug)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
    />
  )
}

export default ProductBreadcrumbStructuredData
