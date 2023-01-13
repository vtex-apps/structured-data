import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

interface Settings {
  decimals: number
  pricesWithTax: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })
  let decimals = 2
  let pricesWithTax = false

  if (data?.appSettings) {
    decimals = data.appSettings.decimals ?? decimals
    pricesWithTax = data.appSettings.pricesWithTax ?? pricesWithTax
  }

  return { decimals, pricesWithTax }
}

export default useAppSettings
