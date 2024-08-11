interface Menu {
  name: string
  action?: (...args: any[]) => any
  submenu?: Menu[]
}

type TriggerType = 'daily' | 'minutely'

interface Trigger {
  type: TriggerType
  action: Function
  payload?: Record<string, any>
}

type Extension = { new (...args: any[]): any }

declare interface IGlobal {
  Menus: Menu[]
  Triggers: Trigger[]
  Extensions: Extension[]
}

declare type ActionFn = (...args: any[]) => any
declare type ActionName = `on${string}`
declare type Actions = Record<ActionName, ActionFn>

declare type MenuSymbol = `__MENU_ACTION_${string}__`
declare type MenuAction = (...args: any[]) => any
declare type MenuFns = Record<MenuSymbol, MenuAction>
declare type Global = typeof globalThis & IGlobal & Actions & MenuFns
declare let Global: Global
