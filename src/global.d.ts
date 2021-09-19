declare global {
  declare module '*.svg'

  interface Window {
    __POWERED_BY_QIANKUN__: any
  }
}

export {}
