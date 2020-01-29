export interface Menu {
  name: string
  action?: Function
  submenu?: Menu[]
}

export interface Trigger {
  type: 'daily' | 'minutely'
  action: Function
  payload?: { [key: string]: any }
}

export type Extension = { new(...args: any[]): any }

export interface ModelFiled {
  id: string
  name: string
}

export type ModelFileds = ModelFiled[]
