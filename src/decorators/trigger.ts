import type { Extension } from '@/libs/Extension'
import { info } from '@/services/logger'

/** 绑定触发器 */
export function Trigger(type: Trigger['type'], payload?: Record<string, any>) {
  return function (target: Extension, prop: string, descriptor: PropertyDescriptor) {
    // 确保 $trigger 是实例属性而不是原型链上的属性
    if (!Object.prototype.hasOwnProperty.call(target, '$trigger')) {
      Object.defineProperty(target, '$trigger', {
        value: [],
        enumerable: false,
        writable: true,
        configurable: true,
      })
    }

    const originalMethod = descriptor.value

    // 修改原方法的行为
    const action = function (this: Extension, ...args: any[]) {
      const content = payload ? JSON.stringify(payload, null, 2) : undefined
      this.logger.info(`trigger ${type} action.\n${content}`)
      return originalMethod.apply(this, args)
    }

    // 配置项
    const config = { type, payload, action }

    // 将配置项推送到实例的 $trigger 属性中
    target['$trigger'].push(config)

    info(`register trigger action "${type}" "${prop}" (total ${target['$trigger'].length}).`)
  }
}
