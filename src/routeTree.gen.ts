/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createServerRootRoute } from '@tanstack/react-start/server'

import { Route as rootRouteImport } from './routes/__root'
import { Route as LoginRouteImport } from './routes/login'
import { Route as AskMeRouteImport } from './routes/ask-me'
import { Route as AuthRouteRouteImport } from './routes/_auth/route'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthDownloaderRouteImport } from './routes/_auth/downloader'
import { Route as AuthRandomIndexRouteImport } from './routes/_auth/random/index'
import { Route as AuthLibraryIndexRouteImport } from './routes/_auth/library/index'
import { Route as AuthRandomMemeIdRouteImport } from './routes/_auth/random/$memeId'
import { Route as AuthLibraryMemeIdRouteImport } from './routes/_auth/library/$memeId'
import { ServerRoute as ApiAuthSplatServerRouteImport } from './routes/api/auth.$'

const rootServerRouteImport = createServerRootRoute()

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const AskMeRoute = AskMeRouteImport.update({
  id: '/ask-me',
  path: '/ask-me',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRouteRoute = AuthRouteRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthDownloaderRoute = AuthDownloaderRouteImport.update({
  id: '/downloader',
  path: '/downloader',
  getParentRoute: () => AuthRouteRoute,
} as any)
const AuthRandomIndexRoute = AuthRandomIndexRouteImport.update({
  id: '/random/',
  path: '/random/',
  getParentRoute: () => AuthRouteRoute,
} as any)
const AuthLibraryIndexRoute = AuthLibraryIndexRouteImport.update({
  id: '/library/',
  path: '/library/',
  getParentRoute: () => AuthRouteRoute,
} as any)
const AuthRandomMemeIdRoute = AuthRandomMemeIdRouteImport.update({
  id: '/random/$memeId',
  path: '/random/$memeId',
  getParentRoute: () => AuthRouteRoute,
} as any)
const AuthLibraryMemeIdRoute = AuthLibraryMemeIdRouteImport.update({
  id: '/library/$memeId',
  path: '/library/$memeId',
  getParentRoute: () => AuthRouteRoute,
} as any)
const ApiAuthSplatServerRoute = ApiAuthSplatServerRouteImport.update({
  id: '/api/auth/$',
  path: '/api/auth/$',
  getParentRoute: () => rootServerRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/ask-me': typeof AskMeRoute
  '/login': typeof LoginRoute
  '/downloader': typeof AuthDownloaderRoute
  '/library/$memeId': typeof AuthLibraryMemeIdRoute
  '/random/$memeId': typeof AuthRandomMemeIdRoute
  '/library': typeof AuthLibraryIndexRoute
  '/random': typeof AuthRandomIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/ask-me': typeof AskMeRoute
  '/login': typeof LoginRoute
  '/downloader': typeof AuthDownloaderRoute
  '/library/$memeId': typeof AuthLibraryMemeIdRoute
  '/random/$memeId': typeof AuthRandomMemeIdRoute
  '/library': typeof AuthLibraryIndexRoute
  '/random': typeof AuthRandomIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_auth': typeof AuthRouteRouteWithChildren
  '/ask-me': typeof AskMeRoute
  '/login': typeof LoginRoute
  '/_auth/downloader': typeof AuthDownloaderRoute
  '/_auth/library/$memeId': typeof AuthLibraryMemeIdRoute
  '/_auth/random/$memeId': typeof AuthRandomMemeIdRoute
  '/_auth/library/': typeof AuthLibraryIndexRoute
  '/_auth/random/': typeof AuthRandomIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/ask-me'
    | '/login'
    | '/downloader'
    | '/library/$memeId'
    | '/random/$memeId'
    | '/library'
    | '/random'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/ask-me'
    | '/login'
    | '/downloader'
    | '/library/$memeId'
    | '/random/$memeId'
    | '/library'
    | '/random'
  id:
    | '__root__'
    | '/'
    | '/_auth'
    | '/ask-me'
    | '/login'
    | '/_auth/downloader'
    | '/_auth/library/$memeId'
    | '/_auth/random/$memeId'
    | '/_auth/library/'
    | '/_auth/random/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthRouteRoute: typeof AuthRouteRouteWithChildren
  AskMeRoute: typeof AskMeRoute
  LoginRoute: typeof LoginRoute
}
export interface FileServerRoutesByFullPath {
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRoutesByTo {
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRoutesById {
  __root__: typeof rootServerRouteImport
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRouteTypes {
  fileServerRoutesByFullPath: FileServerRoutesByFullPath
  fullPaths: '/api/auth/$'
  fileServerRoutesByTo: FileServerRoutesByTo
  to: '/api/auth/$'
  id: '__root__' | '/api/auth/$'
  fileServerRoutesById: FileServerRoutesById
}
export interface RootServerRouteChildren {
  ApiAuthSplatServerRoute: typeof ApiAuthSplatServerRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/ask-me': {
      id: '/ask-me'
      path: '/ask-me'
      fullPath: '/ask-me'
      preLoaderRoute: typeof AskMeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth/downloader': {
      id: '/_auth/downloader'
      path: '/downloader'
      fullPath: '/downloader'
      preLoaderRoute: typeof AuthDownloaderRouteImport
      parentRoute: typeof AuthRouteRoute
    }
    '/_auth/random/': {
      id: '/_auth/random/'
      path: '/random'
      fullPath: '/random'
      preLoaderRoute: typeof AuthRandomIndexRouteImport
      parentRoute: typeof AuthRouteRoute
    }
    '/_auth/library/': {
      id: '/_auth/library/'
      path: '/library'
      fullPath: '/library'
      preLoaderRoute: typeof AuthLibraryIndexRouteImport
      parentRoute: typeof AuthRouteRoute
    }
    '/_auth/random/$memeId': {
      id: '/_auth/random/$memeId'
      path: '/random/$memeId'
      fullPath: '/random/$memeId'
      preLoaderRoute: typeof AuthRandomMemeIdRouteImport
      parentRoute: typeof AuthRouteRoute
    }
    '/_auth/library/$memeId': {
      id: '/_auth/library/$memeId'
      path: '/library/$memeId'
      fullPath: '/library/$memeId'
      preLoaderRoute: typeof AuthLibraryMemeIdRouteImport
      parentRoute: typeof AuthRouteRoute
    }
  }
}
declare module '@tanstack/react-start/server' {
  interface ServerFileRoutesByPath {
    '/api/auth/$': {
      id: '/api/auth/$'
      path: '/api/auth/$'
      fullPath: '/api/auth/$'
      preLoaderRoute: typeof ApiAuthSplatServerRouteImport
      parentRoute: typeof rootServerRouteImport
    }
  }
}

interface AuthRouteRouteChildren {
  AuthDownloaderRoute: typeof AuthDownloaderRoute
  AuthLibraryMemeIdRoute: typeof AuthLibraryMemeIdRoute
  AuthRandomMemeIdRoute: typeof AuthRandomMemeIdRoute
  AuthLibraryIndexRoute: typeof AuthLibraryIndexRoute
  AuthRandomIndexRoute: typeof AuthRandomIndexRoute
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthDownloaderRoute: AuthDownloaderRoute,
  AuthLibraryMemeIdRoute: AuthLibraryMemeIdRoute,
  AuthRandomMemeIdRoute: AuthRandomMemeIdRoute,
  AuthLibraryIndexRoute: AuthLibraryIndexRoute,
  AuthRandomIndexRoute: AuthRandomIndexRoute,
}

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRouteRoute: AuthRouteRouteWithChildren,
  AskMeRoute: AskMeRoute,
  LoginRoute: LoginRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
const rootServerRouteChildren: RootServerRouteChildren = {
  ApiAuthSplatServerRoute: ApiAuthSplatServerRoute,
}
export const serverRouteTree = rootServerRouteImport
  ._addFileChildren(rootServerRouteChildren)
  ._addFileTypes<FileServerRouteTypes>()
