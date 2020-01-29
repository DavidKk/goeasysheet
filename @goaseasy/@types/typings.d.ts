declare namespace Goaseasy {
  interface Menu {
    name: string
    action?: Function
    submenu?: Menu[]
  }
  
  interface Trigger {
    type: 'daily' | 'minutely'
    action: Function
    payload?: { [key: string]: any }
  }
  
  type Extension = { new(...args: any[]): any }
}

declare const Global: typeof globalThis & {
  Menus: any[]
  Triggers: any[]
  Extensions: any[]
}

// eslint-disable-next-line @typescript-eslint/camelcase
declare const __webpack_public_path__: string
