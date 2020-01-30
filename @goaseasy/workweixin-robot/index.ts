import { useMenu, useTrigger } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import { inEffectTimeRange } from '@goaseasy/core/utils/datetime'
import { minutelyInterval } from '@goaseasy/runtime/constants/settings'
import { render as renderTemplate } from '@goaseasy/core/utils/template'
import ScheduleModel from './models/Schedule'
import RobotServ from './services/Robot'
import * as ScheduleTypings from './types/schedule'

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
  public created (): void {
    super.created()
    this.mSchedule.created()
  }

  @useMenu('卸载')
  public destroy (): void {
    super.destroy()
    this.mSchedule.destroy()
  }

  @useMenu('触发每分触发器')
  @useTrigger('minutely')
  public minutelyReport (): void {
    const tasks = this.getMinutelyTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    return this.sendMessage(tasks)
  }

  @useMenu('触发每日触发器')
  @useTrigger('daily')
  public dailyReport (): void {
    const tasks = this.getDailyTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    return this.sendMessage(tasks)
  }

  public sendMessage <T extends ScheduleTypings.ScheduleType>(tasks: Array<ScheduleTypings.Schedule<T>>): void {
    const sender: { [key: string]: string[] } = {}
    const templates: { [key: string]: string } = {}

    tasks.forEach((task) => {
      const { content, apikey, template } = task
      if (!templates[apikey]) {
        templates[apikey] = template
      }

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
      const template = templates[apikey]

      if (messages.length > 0) {
        const content = template ? renderTemplate(messages, template) : messages.join(',')
        const reason = this.sRobot.sendMessage(content, 'text', { apikey })
  
        if (reason !== true) {
          MailApp.sendEmail('qowera@gmail.com', '脚本执行错误', reason)
        }
      }
    })
  }

  public getMinutelyTasks (): Array<ScheduleTypings.Schedule<'minutely'>> {
    const perMinutes = parseInt(this.$runtime.getOptions('minutely'), 10) || minutelyInterval
    if (!(perMinutes > 0)) {
      return []
    }

    const tasks = this.mSchedule.fetchTasks('minutely')
    if (tasks.length === 0) {
      return []
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()

    return tasks.filter((task) => {
      const { type, datetime } = task
      if (type !== 'minutely') {
        return false
      }

      if (datetime instanceof Date) {
        return datetime.getFullYear() === year
          && datetime.getMonth() === month
          && datetime.getDate() === date
          && inEffectTimeRange(datetime.getHours(), datetime.getMinutes(), hours, minutes, perMinutes)
      }

      const { days, clocks } = datetime
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
  }

  public getDailyTasks (): Array<ScheduleTypings.Schedule<'daily'>> {
    const tasks = this.mSchedule.fetchTasks('daily')
    if (tasks.length === 0) {
      return []
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()

    const isSameDate = (datetime: Date) => {
      return datetime.getFullYear() === year
        && datetime.getMonth() === month
        && datetime.getDate() === date
    }

    return tasks.filter((task) => {
      const { type, datetime } = task
      if (type !== 'daily') {
        return false
      }

      if (datetime instanceof Date) {
        return isSameDate(datetime)
      }

      const { dates } = datetime
      for (let i = 0; i < dates.length; i ++) {
        const item = dates[i]
        if (item instanceof Date) {
          if (isSameDate(item)) {
            return true
          }
        } else {
          if ((!isNaN(item.year * 1) ? item.year === year : true) && item.month === month && item.date === date) {
            return true
          }
        }
      }

      return false
    })
  }
}
