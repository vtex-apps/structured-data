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
        message: '{"decimals": 4, "pricesWithTax": true}',
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
        message: '{"decimals": null, "pricesWithTax": null}',
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

  expect(result.current.decimals).toBe(4)
  expect(result.current.pricesWithTax).toBe(true)
  expect(result.current.useSellerDefault).toBe(true)
})

test('should return default object', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mockQueryDataNull])

  await waitForNextUpdate()

  expect(result.current.decimals).toBe(2)
  expect(result.current.pricesWithTax).toBe(false)
  expect(result.current.useSellerDefault).toBe(false)
})
