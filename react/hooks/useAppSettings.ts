import { useQuery } from 'react-apollo'

import GET_SETTINGS from '../queries/getSettings.graphql'

interface Settings {
  decimals: number
  pricesWithTax: boolean
}

const useAppSettings = (): Settings => {
  const { data } = useQuery(GET_SETTINGS, { ssr: false })

  if (data?.appSettings) {
    return data.appSettings
  }

  return { decimals: 2, pricesWithTax: false }
}

export default useAppSettings
