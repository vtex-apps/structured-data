export interface BreadcrumbList {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: ListItem[]
}

export interface ListItem {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}
