import { useMenu } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import SettingsModel from './models/Settings'
import * as Types from './types/runtime'

let GlobalMenuActionId = 0

@useMenu('核心库')
export default class Runtime extends Extension {
  protected extensions: Extension[] = []
  protected mSettings: SettingsModel

  constructor(params: Types.RuntimeParams) {
    super()

    if (Array.isArray(params.extensions) && params.extensions.length > 0) {
      this.extensions = params.extensions.map((Extension) => {
        const extension = new Extension()
        extension.$setRuntime(this)
        return extension
      })
    }

    if (this.ui && Array.isArray(params.menus) && params.menus.length > 0) {
      try {
        const uiMenu = this.createMenus(params.menus)
        uiMenu && uiMenu.addToUi()
      } catch (error) {
        // 因为可能使用触发器, 导致UI无法使用报错
        // nothing todo...
      }
    }

    this.mSettings = new SettingsModel()
  }

  public created(): void {
    super.created()
    this.mSettings.created()
  }

  @useMenu('卸载')
  public destroy(ui: boolean = true): void {
    if (ui) {
      if (!this.confirm('该操作会卸载所有插件, 确认卸载?')) {
        return
      }
    }

    super.destroy()
    this.extensions.forEach((extension) => extension.destroy())
    this.mSettings.destroy()

    ui && this.toast('卸载成功')
  }

  public getOptions(): { [key: string]: any }
  public getOptions(key: string): string
  public getOptions(key?: string) {
    return key ? this.mSettings.get(key) : this.mSettings.getValues()
  }

  private createMenus(menus: Goaseasy.Menu[] = Global.Menus || [], uiMenu: GoogleAppsScript.Base.Menu | null = this.createUiAddonMenu()): GoogleAppsScript.Base.Menu | null {
    if (!this.ui) {
      return null
    }

    if (!(Array.isArray(menus) && menus.length > 0)) {
      return null
    }

    menus.forEach((menu) => {
      if (Array.isArray(menu.submenu)) {
        const uiSubmenu = this.createUiMenu(menu.name)
        uiMenu.addSubMenu(this.createMenus(menu.submenu, uiSubmenu))
      } else if (typeof menu.action === 'function') {
        const alias = `__MENU_ACTION_${(++GlobalMenuActionId).toString(32)}__`
        uiMenu.addItem(menu.name, alias)
        Global[alias] = menu.action
      }
    })

    return uiMenu
  }

  private createUiAddonMenu(): GoogleAppsScript.Base.Menu | null {
    return this.ui ? this.ui.createAddonMenu() : null
  }

  private createUiMenu(name: string): GoogleAppsScript.Base.Menu | null {
    return this.ui ? this.ui.createMenu(name) : null
  }
}
