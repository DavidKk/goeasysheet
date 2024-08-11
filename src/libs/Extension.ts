import { upperFirst, template as compileTemplate, type TemplateOptions } from 'lodash'
import type { Runtime } from '@/core/Runtime'
import { minutelyInterval, dailyTime } from '@/constants/trigger'
import { renderMenuToTreeString } from '@/utils/renderMenuToTreeString'
import { Sheet } from './Sheet'
import { getGlobal } from '@/services/global'

export interface Menu {
  name: string
  action?: (...args: any[]) => any
  submenu?: Menu[]
}

export type TriggerType = 'daily' | 'minutely'

export interface Trigger {
  type: TriggerType
  action: Function
  payload?: Record<string, any>
}

export class Extension extends Sheet {
  static NAME = 'AnonymousExtension'

  /** 核心库 */
  protected $runtime: Runtime | null
  /** 菜单，绝对不能初始化 */
  protected $menu: Menu[]
  /** 触发器，绝对不能初始化 */
  protected $trigger: Trigger[]
  /** 分钟间隔时间 */
  protected minutelyInterval: number
  /** 每日时间 */
  protected dailyTime: string

  protected get app() {
    return SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp : null
  }

  protected get ui() {
    try {
      return this.app ? this.app.getUi() : null
    } catch (error) {
      return null
    }
  }

  constructor() {
    super()

    this.$runtime = null
    this.minutelyInterval = minutelyInterval
    this.dailyTime = dailyTime

    this.initTrigger()
  }

  public created() {
    this.logger.info('extension created')

    this.$runtime && this.$runtime.created()
    this.registerTriggers()
  }

  public destroy() {
    this.logger.info('extension destroy.')

    this.unregisterTriggers()
  }

  /** 初始化菜单 */
  protected initMenu() {
    this.logger.info('init menus.')

    if (!(Array.isArray(this.$menu) && this.$menu.length > 0)) {
      return
    }

    const global = getGlobal()
    const menus = this.bindMenu(this.$menu)
    global.Menus.push(...menus)

    this.logger.ok(`init menus completed.\n[MENU]\n${renderMenuToTreeString(menus)}`)
  }

  /** 绑定菜单事件 */
  protected bindMenu(menus = this.$menu): Menu[] {
    return menus.map((menu) => {
      const { name, action: mAction, submenu: mSubmenu } = menu
      mAction && this.logger.info(`bind menu action "${name}" ${mAction ? `"${mAction?.name}"` : ''}.`)

      const action = typeof mAction === 'function' ? (...args: any[]) => mAction.apply(this, args) : undefined
      const submenu = Array.isArray(mSubmenu) ? this.bindMenu(mSubmenu) : undefined
      return { name, action, submenu: submenu }
    })
  }

  /** 初始化触发器 */
  protected initTrigger() {
    this.logger.info('init triggers.')

    if (!(this?.$trigger?.length > 0)) {
      this.logger.warn('no triggers to init.')
      return
    }

    const triggers = this.$trigger.map((trigger) => {
      const action = (...args: any[]) => trigger.action.apply(this, args)
      return { ...trigger, action }
    })

    const global = getGlobal()
    global.Triggers.push(...triggers)
    this.logger.ok(`init ${triggers.length} triggers completed. (total ${global.Triggers.length})`)
  }

  /** 注册触发器 */
  protected registerTriggers() {
    this.logger.info('register triggers.')
    const triggers = this.fetchUniqTriggerEvents()
    this.logger.info(`fetch ${triggers.length} uniq triggers.`)

    if (!(triggers?.length > 0)) {
      this.logger.warn('no triggers to register.')
      return
    }

    for (const [type, action] of triggers) {
      this.logger.info(`register ${type} trigger.`)

      if (!this.isClockTrigger(type)) {
        this.logger.warn(`"${type}" is not a clock trigger.`)
        continue
      }

      this.createClockTrigger(type, action)
    }

    this.logger.ok(`registered ${triggers.length} triggers.`)
  }

  /** 销毁触发器 */
  protected unregisterTriggers() {
    this.logger.info('unregister triggers.')

    const triggers = this.fetchUniqTriggerEvents()
    this.logger.info(`fetch ${triggers.length} uniq triggers.`)

    if (!(Array.isArray(triggers) && triggers.length > 0)) {
      this.logger.warn('no triggers to unregister.')
      return
    }

    for (const [type, action] of triggers) {
      if (!this.isClockTrigger(type)) {
        this.logger.warn(`"${type}" is not a clock trigger.`)
        continue
      }

      this.deleteClockTrigger(action)
    }

    this.logger.ok(`unregistered ${triggers.length} triggers.`)
  }

  /** 创建计划任务 */
  protected createClockTrigger(type: Trigger['type'], name: string) {
    switch (type) {
      case 'daily':
        return this.createDailyTrigger(name)
      case 'minutely':
        return this.createMinutelyTrigger(name)
    }
  }

  /** 创建每日触发器 */
  protected createDailyTrigger(name: string) {
    this.logger.info(`create daily trigger "${name}".`)

    if (this.existsClockTrigger(name)) {
      this.logger.info(`daily trigger "${name}" already exists.`)
      return false
    }

    const [sHour, sMinute] = this.dailyTime.split(':')
    const hour = parseInt(sHour, 10)
    const minute = parseInt(sMinute, 10)

    ScriptApp.newTrigger(name).timeBased().everyDays(1).atHour(hour).nearMinute(minute).create()
    this.logger.ok(`daily trigger "${name}" created.`)

    return true
  }

  /** 创建分钟触发器 */
  protected createMinutelyTrigger(name: string) {
    this.logger.info(`create minutely trigger "${name}".`)

    if (this.existsClockTrigger(name)) {
      this.logger.info(`minutely trigger "${name}" already exists.`)
      return false
    }

    ScriptApp.newTrigger(name).timeBased().everyMinutes(this.minutelyInterval).create()
    this.logger.ok(`minutely trigger "${name}" created.`)

    return true
  }

  /** 删除计划任务触发器 */
  protected deleteClockTrigger(name: string) {
    this.logger.info(`delete clock trigger "${name}".`)

    const minutelyTriggers = this.fetchClockTrigger(name)
    if (!(Array.isArray(minutelyTriggers) && minutelyTriggers.length > 0)) {
      this.logger.warn(`clock trigger "${name}" not found.`)
      return
    }

    minutelyTriggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger))
    this.logger.ok(`clock trigger "${name}" deleted.`)
  }

  /** 获取计划任务触发器 */
  protected fetchClockTrigger(name: string) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const triggers = ScriptApp.getUserTriggers(spreadsheet)
    const minutelyTriggers = triggers.filter((trigger) => {
      const isClockEvent = trigger.getEventType() === ScriptApp.EventType.CLOCK
      const isOnMinutelyEvent = trigger.getHandlerFunction() === name

      trigger.getTriggerSource()
      return isClockEvent && isOnMinutelyEvent
    })

    return minutelyTriggers
  }

  /** 计划任务触发器是否存在 */
  protected existsClockTrigger(name: string) {
    return this.fetchClockTrigger(name).length > 0
  }

  /** 是否为计划任务触发器 */
  protected isClockTrigger(type: string) {
    return ['daily', 'minutely'].indexOf(type) !== -1
  }

  /** 获取去重的触发事件 */
  protected fetchUniqTriggerEvents() {
    this.logger.info(`[fetchUniqTriggerEvents] fetch uniq trigger events.`)

    if (!(this.$trigger?.length > 0)) {
      this.logger.warn('[fetchUniqTriggerEvents] no uniq trigger events.')
      return []
    }

    this.logger.info(`[fetchUniqTriggerEvents] fetch ${this.$trigger.length} trigger events.`)

    const global = getGlobal()
    const g = function* (this: Extension) {
      for (const { type } of this.$trigger) {
        const action = `on${upperFirst(type)}` as const
        if (typeof global[action] !== 'function') {
          this.logger.warn(`[fetchUniqTriggerEvents] trigger type "${type}" is not support.`)
          continue
        }

        yield [type, action] as const
      }
    }

    const triggers = Array.from(g.call(this))
    this.logger.info(`[fetchUniqTriggerEvents] fetch ${triggers.length} uniq trigger events.`)

    return triggers
  }

  protected alert(content: string) {
    this.ui && this.ui.alert(content)
  }

  protected confirm(content: string) {
    if (this.ui) {
      const response = this.ui.alert(content, this.ui.ButtonSet.YES_NO)
      return response === this.ui.Button.YES
    }

    return false
  }

  protected toast(content: string) {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    typeof ss.toast === 'function' && ss.toast(content)
  }

  protected $setRuntime(runtime: Extension) {
    Object.defineProperty(this, '$runtime', { writable: false, value: runtime })
  }

  public compile(template: string, options?: TemplateOptions) {
    return compileTemplate(template, options)
  }

  public render(data: any, template: string): string {
    const render = this.compile(template)
    return render(data)
  }
}
