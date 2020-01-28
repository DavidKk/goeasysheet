declare interface Menu {
  name: string
  action?: Function
  submenu?: Menu[]
}

declare const Global: {
  Menus: Menu[]
}

declare const __webpack_public_path__: string
