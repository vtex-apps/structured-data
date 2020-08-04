import { canUseDOM } from 'vtex.render-runtime'

interface Runtime {
  rootPath?: string
}

declare let global: {
  __hostname__: string
  __protocol__: string
  __pathname__: string
  __RUNTIME__: Runtime
}

declare let window: {
  __RUNTIME__: Runtime
  location: Window['location']
}

export const getBaseUrl = () => {
  const protocol = 'https'
  const hostname = canUseDOM ? window.location.hostname : global.__hostname__
  const rootPath = canUseDOM
    ? window.__RUNTIME__.rootPath
    : global.__RUNTIME__.rootPath

  const baseUrl = `${protocol}://${hostname}${rootPath ?? ''}`

  return baseUrl
}
