import assign from 'lodash/assign'
import { ROBOT_SEND_URL } from '../constants/robot'
import * as Types from '../types/robot'

export default class RobotService {
  private settings: Types.Settings = {
    apikey: '',
  }

  public configure(options: Partial<Types.Settings> = {}): void {
    assign(this.settings, options)
  }

  protected resolveAraguments<T extends 'text'>(content: string | Get<Types.SendMessageParams<'text'>, 'text'>, type: 'text'): Types.SendMessageParams<'text'>
  protected resolveAraguments<T extends 'markdown'>(content: Get<Types.SendMessageParams<'markdown'>, 'markdown'>, type: 'markdown'): Types.SendMessageParams<'markdown'>
  protected resolveAraguments<T extends 'news'>(content: Get<Types.SendMessageParams<'news'>, 'articles'>, type: 'news'): Types.SendMessageParams<'news'>
  protected resolveAraguments(content: any, type: Types.MessageType): any {
    if (type === 'text' && typeof content === 'string') {
      content = { content }
    }

    return {
      msgtype: type,
      [type]: content,
    }
  }

  public sendMessage<T extends 'text'>(content: string | Get<Types.SendMessageParams<'text'>, 'text'>, type?: 'text', options?: Partial<Types.Settings>): true | string
  public sendMessage<T extends 'markdown'>(content: Get<Types.SendMessageParams<'markdown'>, 'markdown'>, type?: 'markdown', options?: Partial<Types.Settings>): true | string
  public sendMessage<T extends 'news'>(content: Get<Types.SendMessageParams<'news'>, 'articles'>, type?: 'news', options?: Partial<Types.Settings>): true | string
  public sendMessage(content: any, type: Types.MessageType = 'text', options: Partial<Types.Settings> = {}): true | string {
    const settings: Types.Settings = assign({}, this.settings, options)
    const { apikey } = settings
    if (!apikey) {
      return `API_KEY 缺失`
    }

    const payload = this.resolveAraguments(content, type as any)
    const url = `${ROBOT_SEND_URL}?key=${apikey}`
    const params = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
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
