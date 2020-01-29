export interface Clock {
  hours?: number
  minutes?: number
  seconds?: number
}

export interface DayTime {
  day: number[]
  clock: Clock[] | Date[]
}

export interface Task {
  content: string
  daytime: DayTime | Date
  apikey: string
  minutes: number
}
