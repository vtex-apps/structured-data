import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

interface Settings {
  decimals: number
  pricesWithTax: boolean
  useSellerDefault: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })
  let decimals = 2
  let pricesWithTax = false
  let useSellerDefault = false

  if (data?.appSettings) {
    decimals = data.appSettings.decimals ?? decimals
    pricesWithTax = data.appSettings.pricesWithTax ?? pricesWithTax
    useSellerDefault = data.appSettings.useSellerDefault ?? useSellerDefault
  }

  return { decimals, pricesWithTax, useSellerDefault }
}

export default useAppSettings
