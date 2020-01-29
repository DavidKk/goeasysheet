let GlobalMenuActionId = 0

export function createMenus (menus: Goaseasy.Menu[] = Global.Menus || [], uiMenu: GoogleAppsScript.Base.Menu = SpreadsheetApp.getUi().createAddonMenu()) {
  menus.forEach((menu) => {
    if (Array.isArray(menu.submenu)) {
      const uiSubmenu = SpreadsheetApp.getUi().createMenu(menu.name)
      uiMenu.addSubMenu(createMenus(menu.submenu, uiSubmenu))

    } else if (typeof menu.action === 'function') {
      const alias = `__MENU_ACTION_${(++ GlobalMenuActionId).toString(32)}__`
      uiMenu.addItem(menu.name, alias)
      Global[alias] = menu.action
    }
  })

  return uiMenu
}
