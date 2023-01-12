import { Service, IOClients, ServiceContext, RecorderState } from '@vtex/api'

export default new Service<IOClients, RecorderState, ServiceContext>({
  graphql: {
    resolvers: {
      Query: {
        appSettings: async (_: void, __: void, ctx: ServiceContext) => {
          const {
            clients: { apps },
            vtex: { logger },
          } = ctx

          const appId = process.env.VTEX_APP_ID as string

          return apps.getAppSettings(appId).catch((error) => {
            logger.error({
              message: 'getAppSettings-error',
              error,
            })

            return null
          })
        },
      },
    },
  },
})
