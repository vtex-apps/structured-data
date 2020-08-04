/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { ComponentType, ReactElement, ReactType } from 'react'

  interface ChildBlockProps {
    id: string
  }

  export const ChildBlock: ComponentType<ChildBlockProps>

  export const Helmet: ReactElement
  export const Link: ReactType
  export const NoSSR: ReactElement
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean
}
