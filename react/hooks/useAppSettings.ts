import { useQuery } from 'react-apollo'
import { useEffect, useState } from 'react'

import GET_SETTINGS from '../queries/getSettings.graphql'

const DEFAULT_DECIMALS = 2
const DEFAULT_PRICES_WITH_TAX = false
const DEFAULT_PRICES_HIDDEN = false

interface Settings {
  decimals: number
  pricesWithTax: boolean
  pricesHidden: boolean
}

const useAppSettings = (): Settings => {
  const [settings, setSettings] = useState<Settings>({
    decimals: DEFAULT_DECIMALS,
    pricesWithTax: DEFAULT_PRICES_WITH_TAX,
    pricesHidden: DEFAULT_PRICES_HIDDEN,
  })

  const { data, loading } = useQuery(GET_SETTINGS, { ssr: false })

  useEffect(() => {
    if (!loading && data?.appSettings?.message) {
      const { decimals, pricesWithTax, pricesHidden } = JSON.parse(
        data.appSettings.message
      )

      if (
        decimals !== undefined &&
        decimals !== null &&
        pricesWithTax !== null &&
        pricesWithTax !== undefined &&
        pricesHidden !== null &&
        pricesHidden !== undefined
      ) {
        setSettings({ decimals, pricesWithTax, pricesHidden })
      }
    }
  }, [loading, data])

  return settings
}

export default useAppSettings
