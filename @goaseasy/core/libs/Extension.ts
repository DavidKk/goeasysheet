import findIndex from 'lodash/findIndex'
import Goaseasy from './Goaseasy'
import Handlebars from '../services/template'
import { pascalCase } from '../utils/string'
import { minutelyInterval, dailyTime } from '../constants/trigger'

export default class Extension extends Goaseasy {
  protected $runtime: any
  protected $menu: Goaseasy.Menu[]
  protected $trigger: Goaseasy.Trigger[]
  protected minutelyInterval: number
  protected dailyTime: string

  protected get app(): GoogleAppsScript.Spreadsheet.SpreadsheetApp | null {
    return SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp : null
  }

  protected get ui(): GoogleAppsScript.Base.Ui | null {
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

    this.initMenu()
    this.initTrigger()
  }

  public created(): void {
    this.$runtime && this.$runtime.created()
    this.registerTriggers()
  }

  public destroy(): void {
    this.unregisterTriggers()
  }

  private initMenu(): void {
    if (!(Array.isArray(this.$menu) && this.$menu.length > 0)) {
      return
    }

    if (!(Global && Array.isArray(Global.Menus))) {
      Object.defineProperty(Global, 'Menus', { writable: false, value: [] })
    }

    const menus = this.bindMenu(this.$menu)
    Global.Menus.push(...menus)
  }

  private bindMenu(menus: Goaseasy.Menu[] = this.$menu): Goaseasy.Menu[] {
    return menus.map((menu: Goaseasy.Menu) => {
      const name = menu.name
      const action = typeof menu.action === 'function' ? (...args: any[]) => menu.action.apply(this, args) : undefined
      const submenu = Array.isArray(menu.submenu) ? this.bindMenu(menu.submenu) : undefined
      return { name, action, submenu }
    })
  }

  private initTrigger(): void {
    if (!(Array.isArray(this.$trigger) && this.$trigger.length > 0)) {
      return
    }

    if (!(Global && Array.isArray(Global.Triggers))) {
      Object.defineProperty(Global, 'Triggers', { writable: false, value: [] })
    }

    const triggers = this.$trigger.map((trigger) => {
      const action = (...args: any[]) => trigger.action.apply(this, args)
      return { ...trigger, action }
    })

    Global.Triggers.push(...triggers)
  }

  protected registerTriggers(): void {
    const triggers = this.fetchUniqTriggerEvents()
    if (Array.isArray(triggers) && triggers.length > 0) {
      triggers.forEach(({ type, action }) => {
        if (this.isClockTrigger(type)) {
          this.createClockTrigger(type, action)
        }
      })
    }
  }

  protected unregisterTriggers(): void {
    const triggers = this.fetchUniqTriggerEvents()
    if (Array.isArray(triggers) && triggers.length > 0) {
      triggers.forEach(({ type, action }) => {
        if (this.isClockTrigger(type)) {
          this.deleteClockTrigger(action)
        }
      })
    }
  }

  protected createClockTrigger(type: Get<Goaseasy.Trigger, 'type'>, name: string): boolean {
    switch (type) {
      case 'daily':
        return this.createDailyTrigger(name)
      case 'minutely':
        return this.createMinutelyTrigger(name)
    }
  }

  protected createDailyTrigger(name: string): boolean {
    if (this.existsClockTrigger(name)) {
      return false
    }

    const [sHour, sMinute] = this.dailyTime.split(':')
    const hour = parseInt(sHour, 10)
    const minute = parseInt(sMinute, 10)

    ScriptApp.newTrigger(name).timeBased().everyDays(1).atHour(hour).nearMinute(minute).create()

    return true
  }

  protected createMinutelyTrigger(name: string): boolean {
    if (this.existsClockTrigger(name)) {
      return false
    }

    ScriptApp.newTrigger(name).timeBased().everyMinutes(this.minutelyInterval).create()

    return true
  }

  protected deleteClockTrigger(name: string): void {
    const minutelyTriggers = this.fetchClockTrigger(name)
    if (Array.isArray(minutelyTriggers) && minutelyTriggers.length > 0) {
      minutelyTriggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger))
    }
  }

  protected fetchClockTrigger(name: string): GoogleAppsScript.Script.Trigger[] {
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

  protected existsClockTrigger(name: string): boolean {
    return this.fetchClockTrigger(name).length > 0
  }

  protected isClockTrigger(type: string): boolean {
    return ['daily', 'minutely'].indexOf(type) !== -1
  }

  protected fetchUniqTriggerEvents(): Array<{ type: Get<Goaseasy.Trigger, 'type'>; action: string }> {
    if (!(Array.isArray(this.$trigger) && this.$trigger.length > 0)) {
      return []
    }

    const types: Array<{ type: Get<Goaseasy.Trigger, 'type'>; action: string }> = []
    this.$trigger.map(({ type }) => {
      if (findIndex(types, { type }) === -1) {
        const action = `on${pascalCase(type)}`
        if (typeof Global[action] === 'function') {
          types.push({ type, action })
        }
      }
    })

    return types
  }

  protected alert(content: string): void {
    this.ui && this.ui.alert(content)
  }

  protected confirm(content: string): boolean {
    if (this.ui) {
      const response = this.ui.alert(content, this.ui.ButtonSet.YES_NO)
      return response === this.ui.Button.YES
    }

    return false
  }

  protected toast(content: string): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    typeof ss.toast === 'function' && ss.toast(content)
  }

  public $setRuntime(runtime: Extension): void {
    Object.defineProperty(this, '$runtime', { writable: false, value: runtime })
  }

  public compile(template: string, options?: CompileOptions): HandlebarsTemplateDelegate<any> {
    return Handlebars.compile(template, options)
  }

  public render(data: any, template: string): string {
    return this.compile(template)(data)
  }
}
