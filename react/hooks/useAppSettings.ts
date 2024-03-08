import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DISABLE_OFFERS = false
const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false
const DEFAULT_USE_SELLER_DEFAULT = false

interface Settings {
  disableOffers: boolean
  decimals: number
  pricesWithTax: boolean
  useSellerDefault: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, {})

  if (data?.publicSettingsForApp?.message) {
    const {
      decimals,
      disableOffers,
      pricesWithTax,
      useSellerDefault,
    } = JSON.parse(data.publicSettingsForApp.message)

    return {
      disableOffers: disableOffers || DEFAULT_DISABLE_OFFERS,
      decimals: decimals || DEFAULT_DECIMALS,
      pricesWithTax: pricesWithTax || DEFAULT_PRICES_WITH_TAX,
      useSellerDefault: useSellerDefault || DEFAULT_USE_SELLER_DEFAULT,
    }
  }

  return {
    disableOffers: DEFAULT_DISABLE_OFFERS,
    decimals: DEFAULT_DECIMALS,
    pricesWithTax: DEFAULT_PRICES_WITH_TAX,
    useSellerDefault: DEFAULT_USE_SELLER_DEFAULT,
  }
}

export default useAppSettings
