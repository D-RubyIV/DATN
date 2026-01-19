export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: 'https://canthshop.uk/api/v1',
    authenticatedEntryPath: '/admin/manage/home',
    unAuthenticatedEntryPath: '/auth/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: true,
}

export default appConfig
