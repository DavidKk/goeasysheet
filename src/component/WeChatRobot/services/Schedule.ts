import { assign } from '../../../share/utils'

export default class RobotService {
  private settings: WeChatRobotSettings = {
    apikey: ''
  }

  constructor () {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const triggers = ScriptApp.getUserTriggers(spreadsheet)
    const dailyTriggers = triggers.filter((triggers) => {
      const isClockEvent = triggers.getEventType() === ScriptApp.EventType.CLOCK
      const isOnDailyEvent = triggers.getHandlerFunction() === 'onDaily'
      return isClockEvent && isOnDailyEvent
    })

    if (dailyTriggers.length === 0) {
      const ui = SpreadsheetApp.getUi()
      const response = ui.alert('未发现任何触发器, 是否需要自动创建每日提醒触发器?', ui.ButtonSet.YES_NO)

      if (response == ui.Button.YES) {
        ScriptApp.newTrigger('onDaily')
        .timeBased().everyDays(1).atHour(8)
        .create()
      }
    }
  }

  public configure (options: Optional<WeChatRobotSettings> = {}): void {
    assign(this.settings, options)
  }

  protected resolveAraguments <T extends 'text'>(content: string | Get<RobotSendMessageParams<'text'>, 'text'>, type: 'text'): RobotSendMessageParams<'text'>
  protected resolveAraguments <T extends 'markdown'>(content: Get<RobotSendMessageParams<'markdown'>, 'markdown'>, type: 'markdown'): RobotSendMessageParams<'markdown'>
  protected resolveAraguments <T extends 'news'>(content: Get<RobotSendMessageParams<'news'>, 'articles'>, type: 'news'): RobotSendMessageParams<'news'>
  protected resolveAraguments (content: any, type: RobotSendMessageType): any {
    if (type === 'text' && typeof content === 'string') {
      content = { content }
    }

    return {
      msgtype: type,
      [type]: content
    }
  }

  public sendMessage (content: string, type: RobotSendMessageType = 'text') {
    const payload = this.resolveAraguments(content, type as any)
    const url = `${ROBOT_SEND_URL}?key=?key=${this.settings.apikey}`
    const params = {
      method: 'post',
      payload: payload
    }

    const response = UrlFetchApp.fetch(url, params as any)
    const responseContent = response.getContentText('UTF-8')
    const responseData = JSON.parse(responseContent)

    const errcode = responseData.errcode
    const errmsg = responseData.errmsg
    if (errcode !== 0) {
      return errmsg
    }
  
    return true
  }
}
