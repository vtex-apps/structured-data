import React, { FC } from 'react'
import { BreadcrumbList, ListItem } from 'schema-dts'
import { jsonLdScriptProps } from 'react-schemaorg'

import { getBaseUrl } from './modules/baseUrl'

interface CategoryTreeItem {
  name: string
  href: string
}

export const getProductBreadcrumb = (
  categoryTree?: CategoryTreeItem[],
  productName?: string,
  productSlug?: string
) => {
  if (!Array.isArray(categoryTree)) {
    return null
  }

  const baseUrl = getBaseUrl()

  const categoryItems: ListItem[] = categoryTree.map((category, index) => ({
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

  return jsonLdScriptProps<BreadcrumbList>({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: categoryItems,
  })
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
  const breadcrumbLD = getProductBreadcrumb(
    categoryTree,
    productName,
    productSlug
  )

  if (!breadcrumbLD) {
    return null
  }

  return <script {...breadcrumbLD} />
}

export default ProductBreadcrumbStructuredData
