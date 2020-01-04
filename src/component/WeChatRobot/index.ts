import SettingModel from './models/Setting'
import ScheduleModel from './models/Schedule'
import RobotService from './services/Robot'
import Model from '../../decorators/model'
import Service from '../../decorators/service'
import Bridge from '../../decorators/bridge'
import { inEffectTimeRange } from '../../share/datetime'
import * as Typings from './typings'

export default class WeChatRobot {
  @Model(SettingModel)
  private mSetting: SettingModel
  @Model(ScheduleModel)
  private mSchedule: ScheduleModel
  @Service(RobotService)
  private sRobot: RobotService

  // 每5分钟运行一次
  private minutely: number

  constructor () {
    this.minutely = 5

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const triggers = ScriptApp.getUserTriggers(spreadsheet)
    const dailyTriggers = triggers.filter((triggers) => {
      const isClockEvent = triggers.getEventType() === ScriptApp.EventType.CLOCK
      const isOnMinutelyEvent = triggers.getHandlerFunction() === 'onMinutely'
      return isClockEvent && isOnMinutelyEvent
    })

    if (dailyTriggers.length === 0) {
      const ui = SpreadsheetApp.getUi()
      const response = ui.alert(`未发现任何触发器, 是否需要自动创建每${this.minutely}分钟提醒触发器?`, ui.ButtonSet.YES_NO)

      if (response == ui.Button.YES) {
        ScriptApp.newTrigger('onMinutely')
        .timeBased().everyMinutes(this.minutely)
        .create()
      }
    }
  }

  @Bridge
  public fetch () {
    return this.mSetting.getValues()
  }

  @Bridge
  public submit (payload: Optional<Typings.SettingModelFields> = {}): void {
    this.mSetting.multiSet(payload)
  }

  public display (): void {
    const module = require('./view/index.html')
    const template = typeof module === 'string' ? module : module.default
    const html = HtmlService.createTemplateFromFile(template).evaluate()
    SpreadsheetApp.getUi().showSidebar(html)
  }

  // 每5分钟执行一次
  public onMinutely () {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()

    const apikey = this.mSetting.get('apikey')
    if (!apikey) {
      return
    }

    const tasks = this.mSchedule.fetchTasks()
    if (tasks.length === 0) {
      return
    }

    this.sRobot.configure({ apikey })

    const needExecTasks = tasks.filter((task) => {
      const { daytime } = task
      if (daytime instanceof Date) {
        return daytime.getFullYear() === year
          && daytime.getMonth() === month
          && daytime.getDate() === date
          && inEffectTimeRange(daytime.getHours(), daytime.getMinutes(), hours, minutes, this.minutely)
      }

      const { day: days, clock: clocks } = daytime
      if (-1 === days.indexOf(day)) {
        return false
      }

      for (let i = 0; i < clocks.length; i ++) {
        const clock = clocks[i]
        if (clock instanceof Date) {
          if (inEffectTimeRange(clock.getHours(), clock.getMinutes(), hours, minutes, this.minutely)) {
            return true
          }
        } else {
          if (inEffectTimeRange(clock.hours, clock.minutes, hours, minutes, this.minutely)) {
            return true
          }
        }
      }
    })

    needExecTasks.forEach((task) => {
      const { content } = task
      MailApp.sendEmail('qowera@gmail.com', '提醒', content)
    })
  }
}
