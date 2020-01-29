export default class Extension {
  protected $menu: Goaseasy.Menu[]

  constructor () {
    this.initMenu()
  }

  private initMenu (): void {
    if (Array.isArray(this.$menu) && this.$menu.length > 0) {
      if (!(Global && Array.isArray(Global.Menus))) {
        Object.defineProperty(Global, 'Menus', { writable: false, value: [] })
      }

      const menus = this.bindMenu(this.$menu)
      Global.Menus.push(...menus)
    }
  }

  private bindMenu (menus: Goaseasy.Menu[] = this.$menu): Goaseasy.Menu[] {
    return menus.map((menu: Goaseasy.Menu) => {
      const name = menu.name
      const action = typeof menu.action === 'function' ? (...args: any[]) => menu.action.apply(this, args) : undefined
      const submenu = Array.isArray(menu.submenu) ? this.bindMenu(menu.submenu) : undefined
      return { name, action, submenu }
    })
  }
}
