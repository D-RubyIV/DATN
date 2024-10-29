export type AppConfig = {
    apiPrefix: string
    baseUrl: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
}

const appConfig: AppConfig = {
    apiPrefix: '/api/v1',
    baseUrl: 'http://localhost:8080', // URL gốc của Spring Boot backend
    authenticatedEntryPath: '/manage',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
}

export default appConfig