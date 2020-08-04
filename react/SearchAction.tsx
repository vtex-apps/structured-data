import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { getBaseUrl } from './modules/baseUrl'

interface Props {
  searchTermPath?: string
}

const SearchAction: FC<Props> = ({ searchTermPath }) => {
  const baseUrl = getBaseUrl()
  const path = !searchTermPath ? '/' : searchTermPath

  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}${path}{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export default SearchAction
