import React from 'react'
import { Helmet } from 'react-helmet'
// @ts-ignore
import { canUseDOM } from 'vtex.render-runtime'

declare var global: {
  __hostname__: string
  __protocol__: string
  __pathname__: string
}

const GoogleSearchBox = () => {
  const hostname = canUseDOM ? window.location.hostname : global.__hostname__
  const protocol = canUseDOM ? window.location.protocol : global.__protocol__
  return (
    <Helmet>
      <script type="application/ld+json">
        {`
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": \`${protocol}//${hostname}/\`,
            "potentialAction": {
                "@type": "SearchAction",
                "target": \`${protocol}//${hostname}/{search_term_string}\`,
                "query-input": "required name=search_term_string"
            }
        `}
      </script>
    </Helmet>
  )
}

export default GoogleSearchBox
