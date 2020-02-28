import React, { FC } from 'react'
import { Helmet } from 'react-helmet'
import { canUseDOM } from 'vtex.render-runtime'

interface Runtime {
  rootPath?: string
}

interface Props {
  searchTermPath?: string
}

declare var global: {
  __hostname__: string
  __protocol__: string
  __pathname__: string
  __RUNTIME__: Runtime
}

declare var window: {
  __RUNTIME__: Runtime
  location: Location
}

const SearchAction: FC<Props> = ({ searchTermPath }) => {
  const protocol = 'https'
  const hostname = canUseDOM ? window.location.hostname : global.__hostname__
  const rootPath = canUseDOM
    ? window.__RUNTIME__.rootPath
    : global.__RUNTIME__.rootPath

  const baseUrl = `${protocol}://${hostname}${rootPath || ''}`
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
