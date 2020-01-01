import SettingModel from './models/Setting'
import ScheduleModel from './models/Schedule'
import ScheduleService from './services/Schedule'
import { Model, Service, Bridge } from '../../libs/Component'

export default class WeChatRobot {
  @Model(SettingModel)
  private mSetting: SettingModel
  @Model(ScheduleModel)
  private mSchedule: ScheduleModel
  @Service(ScheduleService)
  private sSchedule: ScheduleService

  @Bridge
  public fetch () {
    return this.mSetting.getValues()
  }

  @Bridge
  public submit (payload: Optional<WeChatRobotSettingModelFields> = {}): void {
    this.mSetting.multiSet(payload)
  }

  public display (): void {
    const module = require('./view/index.html')
    const template = typeof module === 'string' ? module : module.default
    const html = HtmlService.createTemplateFromFile(template).evaluate()
    SpreadsheetApp.getUi().showSidebar(html)
  }

  public onDuty () {
    const apiToken = this.mSetting.get('apikey')
    if (!apiToken) {
      return
    }

    this.sSchedule.configure({ apiToken })
  }
}
