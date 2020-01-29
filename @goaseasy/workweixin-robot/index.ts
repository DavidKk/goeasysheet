import {
  useMenu, useTrigger,
  Extension,
  inEffectTimeRange
} from '@goaseasy/core'
import ScheduleModel from './models/Schedule'
import RobotServ from './services/Robot'

@useMenu('微信机器人')
export default class WorkWeixinRobot extends Extension {
  protected mSchedule: ScheduleModel
  protected sRobot: RobotServ

  constructor () {
    super()

    this.mSchedule = new ScheduleModel()
    this.sRobot = new RobotServ()
  }

  @useMenu('安装')
  public setup (): void {
    this.mSchedule.create()
    this.registerTriggers()
  }

  @useMenu('卸载')
  public destroy (): void {
    this.mSchedule.destroy()
    this.unregisterTriggers()
  }

  @useTrigger('minutely')
  public minutelyReport (): void {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()

    const tasks = this.mSchedule.fetchTasks('minutely')
    if (tasks.length === 0) {
      return
    }

    const needExecTasks = tasks.filter((task) => {
      const { type, daytime, intervals: perMinutes } = task
      if (type !== 'minutely') {
        return false
      }

      if (daytime instanceof Date) {
        return daytime.getFullYear() === year
          && daytime.getMonth() === month
          && daytime.getDate() === date
          && inEffectTimeRange(daytime.getHours(), daytime.getMinutes(), hours, minutes, perMinutes)
      }

      const { day: days, clock: clocks } = daytime
      if (-1 === days.indexOf(day)) {
        return false
      }

      for (let i = 0; i < clocks.length; i ++) {
        const clock = clocks[i]
        if (clock instanceof Date) {
          if (inEffectTimeRange(clock.getHours(), clock.getMinutes(), hours, minutes, perMinutes)) {
            return true
          }
        } else {
          if (inEffectTimeRange(clock.hours, clock.minutes, hours, minutes, perMinutes)) {
            return true
          }
        }
      }
    })

    const sender: { [key: string]: string[] } = {}
    needExecTasks.forEach((task) => {
      const { content, apikey } = task
      if (!Array.isArray(sender[apikey])) {
        sender[apikey] = []
      }

      const messages = sender[apikey]
      if (messages.indexOf(content) === -1) {
        messages.push(content)
      }
    })

    Object.keys(sender).forEach((apikey) => {
      const messages = sender[apikey]

      if (messages.length > 0) {
        const content = messages.join(';')
        const reason = this.sRobot.sendMessage(content, 'text', { apikey })

        if (reason !== true) {
          MailApp.sendEmail('qowera@gmail.com', '脚本执行错误', reason)
        }
      }
    })
  }
}
