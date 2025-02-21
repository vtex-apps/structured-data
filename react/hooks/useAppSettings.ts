import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DISABLE_OFFERS = false
const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false
const DEFAULT_USE_SELLER_DEFAULT = false
const DEFAULT_USE_IMAGES_ARRAY = false
const DEFAULT_DISABLE_AGGREGATE_OFFER = false

interface Settings {
  disableOffers: boolean
  decimals: number
  pricesWithTax: boolean
  useSellerDefault: boolean
  useImagesArray: boolean
  disableAggregateOffer: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: true })

  if (data?.publicSettingsForApp?.message) {
    const {
      decimals,
      disableOffers,
      pricesWithTax,
      useSellerDefault,
      useImagesArray,
      disableAggregateOffer,
    } = JSON.parse(data.publicSettingsForApp.message)

    return {
      disableOffers: disableOffers || DEFAULT_DISABLE_OFFERS,
      decimals: decimals || DEFAULT_DECIMALS,
      pricesWithTax: pricesWithTax || DEFAULT_PRICES_WITH_TAX,
      useSellerDefault: useSellerDefault || DEFAULT_USE_SELLER_DEFAULT,
      useImagesArray: useImagesArray || DEFAULT_USE_IMAGES_ARRAY,
      disableAggregateOffer:
        disableAggregateOffer || DEFAULT_DISABLE_AGGREGATE_OFFER,
    }
  }

  return {
    disableOffers: DEFAULT_DISABLE_OFFERS,
    decimals: DEFAULT_DECIMALS,
    pricesWithTax: DEFAULT_PRICES_WITH_TAX,
    useSellerDefault: DEFAULT_USE_SELLER_DEFAULT,
    useImagesArray: DEFAULT_USE_IMAGES_ARRAY,
    disableAggregateOffer: DEFAULT_DISABLE_AGGREGATE_OFFER,
  }
}

export default useAppSettings
