import { ListItem } from './breadcrumb'

export interface ProductList {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: ListItem[]
}
