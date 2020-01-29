import { assign } from '@goaseasy/core'
import { ROBOT_SEND_URL } from '../constants/robot'

export default class RobotService {
  private settings: WorkWeixinRobot.Robot.Settings = {
    apikey: ''
  }

  public configure (options: Optional<WorkWeixinRobot.Robot.Settings> = {}): void {
    assign(this.settings, options)
  }

  protected resolveAraguments <T extends 'text'>(content: string | Get<WorkWeixinRobot.Robot.SendMessageParams<'text'>, 'text'>, type: 'text'): WorkWeixinRobot.Robot.SendMessageParams<'text'>
  protected resolveAraguments <T extends 'markdown'>(content: Get<WorkWeixinRobot.Robot.SendMessageParams<'markdown'>, 'markdown'>, type: 'markdown'): WorkWeixinRobot.Robot.SendMessageParams<'markdown'>
  protected resolveAraguments <T extends 'news'>(content: Get<WorkWeixinRobot.Robot.SendMessageParams<'news'>, 'articles'>, type: 'news'): WorkWeixinRobot.Robot.SendMessageParams<'news'>
  protected resolveAraguments (content: any, type: WorkWeixinRobot.Robot.MessageType): any {
    if (type === 'text' && typeof content === 'string') {
      content = { content }
    }

    return {
      msgtype: type,
      [type]: content
    }
  }

  public sendMessage <T extends 'text'>(content: string | Get<WorkWeixinRobot.Robot.SendMessageParams<'text'>, 'text'>, type?: 'text'): true | string
  public sendMessage <T extends 'markdown'>(content: Get<WorkWeixinRobot.Robot.SendMessageParams<'markdown'>, 'markdown'>, type?: 'markdown'): true | string
  public sendMessage <T extends 'news'>(content: Get<WorkWeixinRobot.Robot.SendMessageParams<'news'>, 'articles'>, type?: 'news'): true | string
  public sendMessage (content: any, type: WorkWeixinRobot.Robot.MessageType = 'text'): true | string {
    const payload = this.resolveAraguments(content, type as any)
    const url = `${ROBOT_SEND_URL}?key=${this.settings.apikey}`
    const params = {
      method : 'post',
      contentType : 'application/json',
      payload: JSON.stringify(payload)
    }

    const response = UrlFetchApp.fetch(url, params as any)
    const responseContent = response.getContentText('UTF-8')
    const responseData = JSON.parse(responseContent)

    const errcode = responseData.errcode
    const errmsg = responseData.errmsg
    if (errcode !== 0) {
      return `错误码: ${errcode}; 错误信息: ${errmsg}; 请求参数: ${JSON.stringify(payload)}`
    }

    return true
  }
}
