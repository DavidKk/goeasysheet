import { useMenu } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import SettingsModel from './models/Settings'
import * as Typings from './types/runtime'

let GlobalMenuActionId = 0

export default class Runtime extends Extension {
  protected extensions: Extension[] = []
  protected mSettings: SettingsModel

  constructor (params: Typings.RuntimeParams) {
    super()

    if (Array.isArray(params.extensions) && params.extensions.length > 0) {
      this.extensions = params.extensions.map((Extension) => {
        const extension = new Extension()
        extension.$setRuntime(this)
        return extension
      })
    }

    if (Array.isArray(params.menus) && params.menus.length > 0) {
      this.createMenus(params.menus).addToUi()
    }

    this.mSettings = new SettingsModel()
  }

  @useMenu('安装')
  public created (): void {
    super.created()
    this.mSettings.created()
  }

  @useMenu('卸载')
  public destroy (): void {
    if (this.confirm('该操作会卸载所有插件, 确认卸载?')) {
      super.destroy()
      this.extensions.forEach((extension) => extension.destroy())
      this.mSettings.destroy()
    }
  }

  public getOptions (): { [key: string]: any }
  public getOptions (key: string): string
  public getOptions (key?: string) {
    return key ? this.mSettings.get(key) : this.mSettings.getValues()
  }

  private createMenus (menus: Goaseasy.Menu[] = Global.Menus || [], uiMenu: GoogleAppsScript.Base.Menu = SpreadsheetApp.getUi().createAddonMenu()) {
    menus.forEach((menu) => {
      if (Array.isArray(menu.submenu)) {
        const uiSubmenu = SpreadsheetApp.getUi().createMenu(menu.name)
        uiMenu.addSubMenu(this.createMenus(menu.submenu, uiSubmenu))
  
      } else if (typeof menu.action === 'function') {
        const alias = `__MENU_ACTION_${(++ GlobalMenuActionId).toString(32)}__`
        uiMenu.addItem(menu.name, alias)
        Global[alias] = menu.action
      }
    })
  
    return uiMenu
  }
}
