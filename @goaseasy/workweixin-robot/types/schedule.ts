export interface ScheduleDate {
  year?: number
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

export type ScheduleDatetime<T extends ScheduleType> =
  T extends 'daily' ? ScheduleSpecifiedDateTime :
  T extends 'minutely' ? SchedulePeriodicDateTime :
  null

export interface Schedule<T extends ScheduleType> {
  content: string
  datetime: ScheduleDatetime<T> | Date
  type: T
  apikey: string
  template?: string
}
