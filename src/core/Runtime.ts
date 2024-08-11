import type { Class } from 'utility-types'
import { Extension } from '@/libs/Extension'
import type { Menu as IMenu, Trigger as ITrigger } from '@/libs/Extension'
import { SettingsModel } from '@/models/Settings'
import { Menu, Action } from '@/decorators/menu'
import { renderMenuToTreeString } from '@/utils/renderMenuToTreeString'
import { getGlobal } from '@/services/global'

let GlobalMenuActionId = 0

export interface RuntimeParams {
  extensions?: Class<Extension>[]
  menus?: IMenu[]
  triggers?: ITrigger[]
}

@Menu('核心库')
export class Runtime extends Extension {
  static NAME = 'Runtime'

  protected extensions: Extension[]
  protected menus: IMenu[]
  protected settingsModel: SettingsModel

  constructor(params: RuntimeParams) {
    super()

    const { extensions, menus = [] } = params
    if (Array.isArray(extensions) && extensions.length > 0) {
      this.extensions = extensions.map((Extension) => {
        const extension = new Extension()
        extension['$setRuntime'](this)
        return extension
      })
    }

    if (Array.isArray(menus) && menus.length > 0) {
      this.menus = menus
    }

    this.settingsModel = new SettingsModel()
  }

  protected initMenu() {
    super.initMenu()

    if (!this.ui) {
      return
    }

    if (!(Array.isArray(this.menus) && this.menus.length > 0)) {
      return
    }

    try {
      this.logger.info(`create menu ui.\n[MENU]\n${renderMenuToTreeString(this.menus)}`)

      const uiMenu = this.createMenus(this.menus)
      uiMenu && uiMenu.addToUi()
    } catch (error) {
      // 因为可能使用触发器, 导致UI无法使用报错
      // nothing todo...
    }
  }

  public created() {
    super.created()
    this.settingsModel.created()
  }

  @Action('卸载')
  public destroy(ui = true) {
    if (ui) {
      if (!this.confirm('该操作会卸载所有插件, 确认卸载?')) {
        return
      }
    }

    super.destroy()
    this.extensions.forEach((extension) => extension.destroy())
    this.settingsModel.destroy()

    ui && this.toast('卸载成功')
  }

  /** 获取单一配置 */
  public getOption(key: string) {
    return this.settingsModel.get(key)
  }

  /** 获取所有配置 */
  public getOptions() {
    this.settingsModel.getValues()
  }

  /** 创建菜单 */
  protected createMenus(menus: IMenu[], uiMenu = this.createUIAddonMenu()) {
    if (!this.ui) {
      return null
    }

    if (!uiMenu) {
      return null
    }

    if (!(Array.isArray(menus) && menus.length > 0)) {
      return null
    }

    const global = getGlobal()
    for (const menu of menus) {
      if (Array.isArray(menu.submenu)) {
        const uiSubmenu = this.createUIMenu(menu.name)
        if (uiSubmenu) {
          const sub = this.createMenus(menu.submenu, uiSubmenu)
          sub && uiMenu.addSubMenu(sub)
        }

        continue
      }

      const { action } = menu || {}
      if (typeof action === 'function') {
        const symbol = (++GlobalMenuActionId).toString(32)
        const alias = `__MENU_ACTION_${symbol}__` as const
        uiMenu.addItem(menu.name, alias)
        global[alias] = action
      }
    }

    return uiMenu
  }

  /** 创建 GoogleSheet 扩展上的菜单 */
  protected createUIAddonMenu() {
    return this.ui ? this.ui.createAddonMenu() : null
  }

  /** 创建 GoogleSheet 菜单 */
  protected createUIMenu(name: string) {
    return this.ui ? this.ui.createMenu(name) : null
  }
}
