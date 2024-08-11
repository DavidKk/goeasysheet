import type { Class } from 'utility-types'
import type { Extension, Menu } from '@/libs/Extension'
import { info } from '@/services/logger'

/** 绑定菜单 */
export function Menu(name: string) {
  return function <T extends Class<Extension>>(BaseClass: T): T {
    return class extends BaseClass {
      /** 菜单 */
      protected $menu: Menu[]

      constructor(...args: any[]) {
        super(...args)

        const submenu = this.$menu || []
        const config = { name, submenu }
        this.$menu = [config]

        this.initMenu()
      }
    }
  }
}

/** 绑定菜单行为 */
export function Action(name: string) {
  return function (target: Extension, prop: string, descriptor: PropertyDescriptor) {
    // 确保 $menu 是实例属性而不是原型链上的属性
    if (!Object.prototype.hasOwnProperty.call(target, '$menu')) {
      Object.defineProperty(target, '$menu', {
        value: [],
        enumerable: false,
        writable: true,
        configurable: true,
      })
    }

    const config = { name, action: descriptor.value }
    target['$menu'].push(config)

    info(`register menu action "${name}" "${prop}".`)
  }
}
