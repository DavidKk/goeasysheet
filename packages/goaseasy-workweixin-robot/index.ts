import { useMenu } from 'goaseasy-core'
// import { MinutelyTrigger } from 'goaseasy-core/decorators/trigger'
import ScheduleModel from './models/Schedule'
import SettingModel from './models/Setting'
// import RobotServ from './services/Robot'
// import { inEffectTimeRange } from 'goaseasy-core/utils/datetime'

@useMenu('微信机器人')
export default class WorkWeixinRobot {
  // 运行一次间隔时间
  protected perMinutes: number
  protected mSchedule: ScheduleModel
  protected mSetting: SettingModel
  // protected sRobot: RobotServ

  constructor () {
    this.perMinutes = 5
    this.mSchedule = new ScheduleModel()
    this.mSetting = new SettingModel()
    // this.sRobot = new RobotServ()
  }

  @useMenu('启动')
  public setup () {
    ScriptApp.newTrigger('onMinutely')
    .timeBased().everyMinutes(this.perMinutes)
    .create()
  }

  @useMenu('关闭')
  public destroy () {
    const minutelyTriggers = this.getMinutelyTrigger()
    minutelyTriggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger))
  }

  // @MinutelyTrigger
  // public onMinutely () {
  //   const now = new Date()
  //   const year = now.getFullYear()
  //   const month = now.getMonth()
  //   const date = now.getDate()
  //   const hours = now.getHours()
  //   const minutes = now.getMinutes()
  //   const day = now.getDay()

  //   const apikey = this.mSetting.get('apikey')
  //   if (!apikey) {
  //     return
  //   }

  //   const tasks = this.mSchedule.fetchTasks()
  //   if (tasks.length === 0) {
  //     return
  //   }

  //   this.sRobot.configure({ apikey })

  //   const needExecTasks = tasks.filter((task) => {
  //     const { daytime } = task
  //     if (daytime instanceof Date) {
  //       return daytime.getFullYear() === year
  //         && daytime.getMonth() === month
  //         && daytime.getDate() === date
  //         && inEffectTimeRange(daytime.getHours(), daytime.getMinutes(), hours, minutes, this.perMinutes)
  //     }

  //     const { day: days, clock: clocks } = daytime
  //     if (-1 === days.indexOf(day)) {
  //       return false
  //     }

  //     for (let i = 0; i < clocks.length; i ++) {
  //       const clock = clocks[i]
  //       if (clock instanceof Date) {
  //         if (inEffectTimeRange(clock.getHours(), clock.getMinutes(), hours, minutes, this.perMinutes)) {
  //           return true
  //         }
  //       } else {
  //         if (inEffectTimeRange(clock.hours, clock.minutes, hours, minutes, this.perMinutes)) {
  //           return true
  //         }
  //       }
  //     }
  //   })

  //   const message = []
  //   needExecTasks.forEach((task) => {
  //     const { content } = task
  //     if (message.indexOf(content) === -1) {
  //       message.push(content)
  //     }
  //   })

  //   if (message.length > 0) {
  //     const content = message.join(';')
  //     const reason = this.sRobot.sendMessage(content)
  //     if (reason !== true) {
  //       MailApp.sendEmail('qowera@gmail.com', '脚本执行错误', reason)
  //     }
  //   }
  // }

  public getMinutelyTrigger () {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const triggers = ScriptApp.getUserTriggers(spreadsheet)
    const minutelyTriggers = triggers.filter((trigger) => {
      const isClockEvent = trigger.getEventType() === ScriptApp.EventType.CLOCK
      const isOnMinutelyEvent = trigger.getHandlerFunction() === 'onMinutely'

      trigger.getTriggerSource()
      return isClockEvent && isOnMinutelyEvent
    })

    return minutelyTriggers
  }
}

