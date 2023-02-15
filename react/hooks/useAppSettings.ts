import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false

interface Settings {
  decimals: number
  pricesWithTax: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })

  if (data?.publicSettingsForApp?.message) {
    const { decimals, pricesWithTax } = JSON.parse(
      data.publicSettingsForApp.message
    )

    return {
      decimals: decimals || DEFAULT_DECIMALS,
      pricesWithTax: pricesWithTax || DEFAULT_PRICES_WITH_TAX,
    }
  }

  return {
    decimals: DEFAULT_DECIMALS,
    pricesWithTax: DEFAULT_PRICES_WITH_TAX,
  }
}

export default useAppSettings
