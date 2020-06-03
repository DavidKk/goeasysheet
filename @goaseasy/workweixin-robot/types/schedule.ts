import { MessageType } from './robot'

export interface ScheduleDate {
  year?: number
  // 一月为1, 而非0
  month: number
  date: number
}

export interface ScheduleClock {
  hours: number
  minutes: number
  seconds?: number
}

export interface ScheduleSpecifiedDateTime {
  dates: ScheduleDate[] | Date[]
}

export interface SchedulePeriodicDateTime {
  days: number[]
  clocks: ScheduleClock[] | Date[]
}

export type ScheduleType = Get<Goaseasy.Trigger, 'type'>

export type ScheduleDatetime<T extends ScheduleType> = T extends 'daily' ? ScheduleSpecifiedDateTime : T extends 'minutely' ? SchedulePeriodicDateTime : null

export interface Schedule<T extends ScheduleType> {
  content: string
  datetime: ScheduleDatetime<T> | Date
  apikey: string
  type: T
  messageType: MessageType
  extra: { [key: string]: string }
  template?: string
}
