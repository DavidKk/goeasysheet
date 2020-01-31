import { useMenu, useTrigger } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import { inEffectTimeRange } from '@goaseasy/core/utils/datetime'
import { minutelyInterval } from '@goaseasy/runtime/constants/settings'
import { render as renderTemplate } from '@goaseasy/core/utils/template'
import ScheduleModel from './models/Schedule'
import RobotServ from './services/Robot'
import * as ScheduleTypings from './types/schedule'
import { find } from '@goaseasy/core/utils/array'

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

  @useMenu('触发计划任务')
  public report (): void {
    this.dailyReport()
    this.minutelyReport()
  }

  @useMenu('卸载')
  public destroy (): void {
    super.destroy()
    this.mSchedule.destroy()
  }

  @useTrigger('minutely')
  public minutelyReport (): void {
    const tasks = this.getMinutelyTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    return this.sendMessage(tasks)
  }

  @useTrigger('daily')
  public dailyReport (): void {
    const tasks = this.getDailyTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    return this.sendMessage(tasks)
  }

  public sendMessage <T extends ScheduleTypings.ScheduleType>(tasks: Array<ScheduleTypings.Schedule<T>>): void {
    interface Message {
      template: string
      contents: string[]
    }

    interface Sender {
      apikey: string
      messages: Message[]
    }

    const senders: Sender[] = []
    tasks.forEach((task) => {
      const { apikey, template, content } = task

      let sender: Sender = find(senders, { apikey })
      if (!sender) {
        sender = { apikey, messages: [] }
        senders.push(sender)
      }

      if (!Array.isArray(sender.messages)) {
        sender.messages = []
      }

      let message: Message = find(sender.messages, { template })
      if (!message) {
        message = { template, contents: [] }
        sender.messages.push(message)
      }

      if (!Array.isArray(message.contents)) {
        message.contents = []
      }

      message.contents.push(content)
    })

    senders.forEach((sender) => {
      const { apikey, messages } = sender
      if (Array.isArray(messages) && messages.length > 0) {
        const content = messages.map(({ template, contents }) => template ? renderTemplate(contents, template) : contents.join(','))
        const message = content.join('\n')
        const reason = this.sRobot.sendMessage(message, 'text', { apikey })
        reason !== true && MailApp.sendEmail('qowera@gmail.com', '脚本执行错误', reason)
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
    const month = now.getMonth() + 1
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
    const month = now.getMonth() + 1
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
