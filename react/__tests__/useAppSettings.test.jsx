import { renderHook } from '@testing-library/react-hooks'
import { MockedProvider } from '@apollo/react-testing'
import React from 'react'

import useAppSettings from '../hooks/useAppSettings'
import GET_SETTINGS from '../queries/getSettings.graphql'

const mockQueryData = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      publicSettingsForApp: {
        message:
          '{"decimals": 4, "disableOffers": false, "pricesWithTax": true, "useSellerDefault": true}',
      },
    },
  },
}

const mockQueryDataNull = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      publicSettingsForApp: {
        message:
          '{"decimals": null, "disableOffers": null, "pricesWithTax": null, "useSellerDefault": null}',
      },
    },
  },
}

const mockQueryDataEmpty = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      publicSettingsForApp: {
        message: '{}',
      },
    },
  },
}

const mockQueryDataZeroDecimals = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      publicSettingsForApp: {
        message: '{"decimals": 0, "gtinValue": "itemId"}',
      },
    },
  },
}

const mockQueryDataInvalid = {
  request: {
    query: GET_SETTINGS,
  },
  result: {
    data: {
      publicSettingsForApp: {
        message: 'not json',
      },
    },
  },
}

function getHookWrapper(mocks = []) {
  const wrapper = ({ children }) => (
    <MockedProvider addTypename={false} mocks={mocks}>
      {children}
    </MockedProvider>
  )

  const { result, waitForNextUpdate } = renderHook(() => useAppSettings(), {
    wrapper,
  })

  return { result, waitForNextUpdate }
}

test('should return object', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryData])

  await waitForNextUpdate()

  expect(result.current.disableOffers).toBe(false)
  expect(result.current.decimals).toBe(4)
  expect(result.current.pricesWithTax).toBe(true)
  expect(result.current.useSellerDefault).toBe(true)
})

test('should return default object', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryDataNull])

  await waitForNextUpdate()

  expect(result.current.disableOffers).toBe(false)
  expect(result.current.decimals).toBe(2)
  expect(result.current.pricesWithTax).toBe(false)
  expect(result.current.useSellerDefault).toBe(false)
})

test('should default gtinValue to ean, matching the manifest settingsSchema', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryDataEmpty])

  await waitForNextUpdate()

  expect(result.current.gtinValue).toBe('ean')
  expect(result.current.decimals).toBe(2)
})

test('should keep decimals 0 and the saved gtinValue', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([
    mockQueryDataZeroDecimals,
  ])

  await waitForNextUpdate()

  expect(result.current.decimals).toBe(0)
  expect(result.current.gtinValue).toBe('itemId')
})

test('should fall back to defaults when the settings message is not valid JSON', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryDataInvalid])

  await waitForNextUpdate()

  expect(result.current.gtinValue).toBe('ean')
  expect(result.current.disableOffers).toBe(false)
})
