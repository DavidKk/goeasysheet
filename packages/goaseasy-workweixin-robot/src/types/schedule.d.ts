declare namespace WorkWeixinRobot {
  namespace Schedule {
    interface Clock {
      hours?: number
      minutes?: number
      seconds?: number
    }

    interface DayTime {
      day: number[]
      clock: Clock[] | Date[]
    }

    interface Task {
      content: string
      daytime: DayTime | Date
    }
  }
}
