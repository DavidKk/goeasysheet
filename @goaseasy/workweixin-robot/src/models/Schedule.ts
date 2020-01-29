import {
  ListSheetModel,
  parseGMTHours, parseGMTSeconds,
  sub, mul,
} from '@goaseasy/core'
import { Days } from '../constants/day'

export default class ScheduleModel extends ListSheetModel {
  constructor () {
    super('计划任务', [
      {
        id: 'task',
        name: '任务名称'
      },
      {
        id: 'content',
        name: '发送内容'
      },
      {
        id: 'datetime',
        name: '执行时间'
      },
      {
        id: 'status',
        name: '任务状态'
      }
    ])
  }

  public fetchTasks (): WorkWeixinRobot.Schedule.Task[] {
    const rows = this.select()
    if (rows.length === 0) {
      return []
    }

    const tasks: WorkWeixinRobot.Schedule.Task[] = []
    for (let i = 0; i < rows.length; i ++) {
      const item = rows[i]
      const { task: sheetName, content: contentA1N, datetime: datetimeA1N } = item
      if (!sheetName && !contentA1N && !datetimeA1N) {
        break
      }

      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
      const sheet = spreadsheet.getSheetByName(sheetName)

      const contents = sheet.getRange(contentA1N).getValues()
      const datetimes = sheet.getRange(datetimeA1N).getValues()

      for (let i = 0; i < contents.length; i ++) {
        const content = contents[i][0]
        const datetime = datetimes[i][0]

        if (!(content && datetime)) {
          break
        }

        const daytime = this.convertDayTime(datetime)
        if (!(content && daytime)) {
          continue
        }

        tasks.push({ content, daytime })
      }
    }

    return tasks
  }

  protected convertDayTime (datetime: Date | string): WorkWeixinRobot.Schedule.DayTime {
    if (datetime instanceof Date) {
      const day = []

      if (datetime.getTime() < 0) {
        const { hours, minutes, seconds } = this.convertTime(datetime)
        const clock = [{ hours, minutes, seconds }]
        return { day, clock }
      }

      const hours = datetime.getHours()
      const minutes = datetime.getMinutes()
      const seconds = datetime.getSeconds()
      const clock = [{ hours, minutes, seconds }]
      return { day, clock }
    }

    if (typeof datetime === 'string') {
      const regexp = /^((?:\d{2}:\d{2},?)+)(?:\/((?:(?:Weekday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?)+))?$/i
      const matched = regexp.exec(datetime)

      if (matched) {
        const [, times, days] = matched

        let dayString: Array<string> = days ? days.split(',').filter((v) => v) : []
        if (dayString.length === 0) {
          dayString = [].concat(Days)
        } else if (-1 !== dayString.indexOf('Weekday')) {
          dayString = Days.slice(1, 6)
        }

        const day = dayString.map((name: string) => Days.indexOf(name)).filter((index) => -1 !== index)
        const clock = times.split(',').map((time) => {
          const [hours, minutes, seconds] = time.split(':')
          return { hours: parseInt(hours), minutes: parseInt(minutes), seconds: parseInt(seconds) }
        })
  
        return { day, clock }
      }
    }
  }

  protected convertTime (datetime: Date): WorkWeixinRobot.Schedule.Clock {
    const seconds = parseGMTSeconds(datetime)
    const floatHours = parseGMTHours(datetime)
    const hours = Math.floor(floatHours)
    const decimal = sub(floatHours, hours)
    const minutes = Math.floor(mul(decimal, 60))
    return { hours, minutes, seconds }
  }
}
