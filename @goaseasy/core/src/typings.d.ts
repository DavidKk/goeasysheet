declare namespace Goaseasy {
  interface Menu {
    name: string
    action?: Function
    submenu?: Menu[]
  }

  interface Trigger {
    type: string
    action: Function
    payload?: { [key: string]: any }
  }

  type Extension = { new(...args: any[]): any }

  interface ModelFiled {
    id: string
    name: string
  }

  type ModelFileds = ModelFiled[]
}

declare const Global: typeof globalThis & {
  Menus: Menu[]
  Triggers: Trigger[]
  Extensions: Extension[]
}

// eslint-disable-next-line @typescript-eslint/camelcase
declare const __webpack_public_path__: string
