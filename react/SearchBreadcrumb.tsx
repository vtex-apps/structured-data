import React, { FC } from 'react'
import { Helmet } from 'vtex.render-runtime'
import { BreadcrumbList } from 'schema-dts'
import { helmetJsonLdProp } from 'react-schemaorg'

import { getBaseUrl } from './modules/baseUrl'

interface SearchBreadcrumbItem {
  name: string
  href: string
}

const getSearchBreadcrumb = (breadcrumb?: SearchBreadcrumbItem[]) => {
  if (!Array.isArray(breadcrumb)) {
    return {}
  }

  const baseUrl = getBaseUrl()

  return helmetJsonLdProp<BreadcrumbList>({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: baseUrl + item.href,
    })),
  })
}

interface Props {
  breadcrumb?: SearchBreadcrumbItem[]
}

const SearchBreadcrumbStructuredData: FC<Props> = ({ breadcrumb }) => {
  const breadcrumbLD = getSearchBreadcrumb(breadcrumb)

  return <Helmet script={[breadcrumbLD]} />
}

export default SearchBreadcrumbStructuredData
