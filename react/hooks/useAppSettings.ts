import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false
const DEFAULT_USE_SELLER_DEFAULT = false

interface Settings {
  decimals: number
  pricesWithTax: boolean
  useSellerDefault: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })

  if (data?.publicSettingsForApp?.message) {
    const { decimals, pricesWithTax, useSellerDefault } = JSON.parse(
      data.publicSettingsForApp.message
    )

    return {
      decimals: decimals || DEFAULT_DECIMALS,
      pricesWithTax: pricesWithTax || DEFAULT_PRICES_WITH_TAX,
      useSellerDefault: useSellerDefault || DEFAULT_USE_SELLER_DEFAULT,
    }
  }

  return {
    decimals: DEFAULT_DECIMALS,
    pricesWithTax: DEFAULT_PRICES_WITH_TAX,
    useSellerDefault: DEFAULT_USE_SELLER_DEFAULT,
  }
}

export default useAppSettings
