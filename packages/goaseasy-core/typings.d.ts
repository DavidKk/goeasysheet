declare namespace Goaseasy {
  interface Menu {
    name: string
    action?: Function
    submenu?: Menu[]
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
  Extensions: Extension[]
}

declare const __webpack_public_path__: string
