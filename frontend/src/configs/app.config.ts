// export type AppConfig = {
//     apiPrefix: string
//     authenticatedEntryPath: string
//     unAuthenticatedEntryPath: string
//     tourPath: string
//     locale: string
//     enableMock: boolean
// }

// const appConfig: AppConfig = {
//     apiPrefix: '/api',
//     authenticatedEntryPath: '/home',
//     unAuthenticatedEntryPath: '/sign-in',
//     tourPath: '/',
//     locale: 'en',
//     enableMock: false,
// }

// export default appConfig


export type AppConfig = {
    apiPrefix: string
    baseUrl: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    baseUrl: 'http://localhost:8080', // URL gốc của Spring Boot backend
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
}

export default appConfig
