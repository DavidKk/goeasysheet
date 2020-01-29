import { pascalCase } from '../utils/string'

export default class Extension {
  protected $menu: Goaseasy.Menu[]
  protected $trigger: Goaseasy.Trigger[]

  protected get triggerTypes (): string[] {
    if (!(Array.isArray(this.$trigger) && this.$trigger.length > 0)) {
      return []
    }

    const types = []
    this.$trigger.forEach(({ type }) => {
      if (types.indexOf(type) === -1) {
        types.push(`on${pascalCase(type)}`)
      }
    })

    return types
  }

  constructor () {
    this.initMenu()
    this.initTrigger()
  }

  private initMenu (): void {
    if (!(Array.isArray(this.$menu) && this.$menu.length > 0)) {
      return
    }

    if (!(Global && Array.isArray(Global.Menus))) {
      Object.defineProperty(Global, 'Menus', { writable: false, value: [] })
    }

    const menus = this.bindMenu(this.$menu)
    Global.Menus.push(...menus)
  }

  private initTrigger (): void {
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

  private bindMenu (menus: Goaseasy.Menu[] = this.$menu): Goaseasy.Menu[] {
    return menus.map((menu: Goaseasy.Menu) => {
      const name = menu.name
      const action = typeof menu.action === 'function' ? (...args: any[]) => menu.action.apply(this, args) : undefined
      const submenu = Array.isArray(menu.submenu) ? this.bindMenu(menu.submenu) : undefined
      return { name, action, submenu }
    })
  }

  protected registerTriggers (): void {
    this.triggerTypes.forEach((name) => this.createTrigger(name))
  }

  protected unregisterTriggers (): void {
    this.triggerTypes.forEach((name) => this.deleteTrigger(name))
  }

  protected createTrigger (name: string): void {
    if (!this.existsTrigger(name)) {
      ScriptApp.newTrigger(name)
      .timeBased().everyMinutes(5)
      .create()
    }
  }

  protected deleteTrigger (name: string): void {
    const minutelyTriggers = this.fetchTrigger(name)
    if (Array.isArray(minutelyTriggers) && minutelyTriggers.length > 0) {
      minutelyTriggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger))
    }
  }

  protected fetchTrigger (name: string): GoogleAppsScript.Script.Trigger[] {
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

  protected existsTrigger (name: string): boolean {
    return this.fetchTrigger(name).length > 0
  }
}
