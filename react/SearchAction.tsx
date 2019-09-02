import React from 'react'
import { Helmet } from 'react-helmet'
import { canUseDOM } from 'vtex.render-runtime'

declare var global: {
  __hostname__: string
  __protocol__: string
  __pathname__: string
  __RUNTIME__: {
    rootPath?: string
  }
}

const SearchAction = () => {
  const hostname = canUseDOM ? window.location.hostname : global.__hostname__
  const protocol = canUseDOM ? window.location.protocol : global.__protocol__

  const baseUrl = `${protocol}//${hostname}/${global.__RUNTIME__.rootPath || ''}`

  return (
    <Helmet>
      <script type="application/ld+json">
        {`
          "@context": "http://schema.org",
          "@type": "WebSite",
          "url": "${baseUrl}",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "${baseUrl}{search_term_string}",
            "query-input": "required name=search_term_string"
          }
        `}
      </script>
    </Helmet>
  )
}

export default SearchAction
