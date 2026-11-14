import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DISABLE_OFFERS = false
const DEFAULT_DISABLE_PRODUCT_STRUCTURED_DATA = false
const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false
const DEFAULT_USE_SELLER_DEFAULT = false
const DEFAULT_USE_IMAGES_ARRAY = false
const DEFAULT_DISABLE_AGGREGATE_OFFER = false
// Must match the default declared in manifest.json settingsSchema.
const DEFAULT_GTIN_VALUE = 'ean'

interface Settings {
  disableOffers: boolean
  disableProductStructuredData: boolean
  decimals: number
  pricesWithTax: boolean
  useSellerDefault: boolean
  useImagesArray: boolean
  disableAggregateOffer: boolean
  gtinValue?: string
}

const DEFAULT_SETTINGS: Settings = {
  disableOffers: DEFAULT_DISABLE_OFFERS,
  disableProductStructuredData: DEFAULT_DISABLE_PRODUCT_STRUCTURED_DATA,
  decimals: DEFAULT_DECIMALS,
  pricesWithTax: DEFAULT_PRICES_WITH_TAX,
  useSellerDefault: DEFAULT_USE_SELLER_DEFAULT,
  useImagesArray: DEFAULT_USE_IMAGES_ARRAY,
  disableAggregateOffer: DEFAULT_DISABLE_AGGREGATE_OFFER,
  gtinValue: DEFAULT_GTIN_VALUE,
}

const parseSettings = (message: string): Partial<Settings> => {
  try {
    const parsed = JSON.parse(message)

    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: true })

  if (data?.publicSettingsForApp?.message) {
    const {
      decimals,
      disableOffers,
      disableProductStructuredData,
      pricesWithTax,
      useSellerDefault,
      useImagesArray,
      disableAggregateOffer,
      gtinValue,
    } = parseSettings(data.publicSettingsForApp.message)

    // `??` instead of `||` so that falsy but valid values (e.g. `decimals: 0`)
    // are kept.
    return {
      disableOffers: disableOffers ?? DEFAULT_DISABLE_OFFERS,
      disableProductStructuredData:
        disableProductStructuredData ?? DEFAULT_DISABLE_PRODUCT_STRUCTURED_DATA,
      decimals: decimals ?? DEFAULT_DECIMALS,
      pricesWithTax: pricesWithTax ?? DEFAULT_PRICES_WITH_TAX,
      useSellerDefault: useSellerDefault ?? DEFAULT_USE_SELLER_DEFAULT,
      useImagesArray: useImagesArray ?? DEFAULT_USE_IMAGES_ARRAY,
      disableAggregateOffer:
        disableAggregateOffer ?? DEFAULT_DISABLE_AGGREGATE_OFFER,
      gtinValue: gtinValue ?? DEFAULT_GTIN_VALUE,
    }
  }

  return DEFAULT_SETTINGS
}

export default useAppSettings
