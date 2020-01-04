import { assign } from '../../../share/utils'
import { ROBOT_SEND_URL } from '../constants/robot'
import * as Typings from '../typings'

export default class RobotService {
  private settings: Typings.RobotServiceSettings = {
    apikey: ''
  }

  public configure (options: Optional<Typings.RobotServiceSettings> = {}): void {
    assign(this.settings, options)
  }

  protected resolveAraguments <T extends 'text'>(content: string | Get<Typings.RobotServiceSendMessageParams<'text'>, 'text'>, type: 'text'): Typings.RobotServiceSendMessageParams<'text'>
  protected resolveAraguments <T extends 'markdown'>(content: Get<Typings.RobotServiceSendMessageParams<'markdown'>, 'markdown'>, type: 'markdown'): Typings.RobotServiceSendMessageParams<'markdown'>
  protected resolveAraguments <T extends 'news'>(content: Get<Typings.RobotServiceSendMessageParams<'news'>, 'articles'>, type: 'news'): Typings.RobotServiceSendMessageParams<'news'>
  protected resolveAraguments (content: any, type: Typings.RobotServiceMessageType): any {
    if (type === 'text' && typeof content === 'string') {
      content = { content }
    }

    return {
      msgtype: type,
      [type]: content
    }
  }

  public sendMessage <T extends 'text'>(content: string | Get<Typings.RobotServiceSendMessageParams<'text'>, 'text'>, type?: 'text'): true | string
  public sendMessage <T extends 'markdown'>(content: Get<Typings.RobotServiceSendMessageParams<'markdown'>, 'markdown'>, type?: 'markdown'): true | string
  public sendMessage <T extends 'news'>(content: Get<Typings.RobotServiceSendMessageParams<'news'>, 'articles'>, type?: 'news'): true | string
  public sendMessage (content: any, type: Typings.RobotServiceMessageType = 'text'): true | string {
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
