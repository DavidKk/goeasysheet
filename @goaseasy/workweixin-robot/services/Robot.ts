import { assign } from '@goaseasy/core/utils/object'
import { ROBOT_SEND_URL } from '../constants/robot'
import * as Typings from '../types/robot'

export default class RobotService {
  private settings: Typings.Settings = {
    apikey: ''
  }

  public configure (options: Partial<Typings.Settings> = {}): void {
    assign(this.settings, options)
  }

  protected resolveAraguments <T extends 'text'>(content: string | Get<Typings.SendMessageParams<'text'>, 'text'>, type: 'text'): Typings.SendMessageParams<'text'>
  protected resolveAraguments <T extends 'markdown'>(content: Get<Typings.SendMessageParams<'markdown'>, 'markdown'>, type: 'markdown'): Typings.SendMessageParams<'markdown'>
  protected resolveAraguments <T extends 'news'>(content: Get<Typings.SendMessageParams<'news'>, 'articles'>, type: 'news'): Typings.SendMessageParams<'news'>
  protected resolveAraguments (content: any, type: Typings.MessageType): any {
    if (type === 'text' && typeof content === 'string') {
      content = { content }
    }

    return {
      msgtype: type,
      [type]: content
    }
  }

  public sendMessage <T extends 'text'>(content: string | Get<Typings.SendMessageParams<'text'>, 'text'>, type?: 'text', options?: Partial<Typings.Settings>): true | string
  public sendMessage <T extends 'markdown'>(content: Get<Typings.SendMessageParams<'markdown'>, 'markdown'>, type?: 'markdown', options?: Partial<Typings.Settings>): true | string
  public sendMessage <T extends 'news'>(content: Get<Typings.SendMessageParams<'news'>, 'articles'>, type?: 'news', options?: Partial<Typings.Settings>): true | string
  public sendMessage (content: any, type: Typings.MessageType = 'text', options: Partial<Typings.Settings> = {}): true | string {
    const settings: Typings.Settings = assign({}, this.settings, options)
    const { apikey } = settings
    if (!apikey) {
      return `API_KEY 缺失`
    }

    const payload = this.resolveAraguments(content, type as any)
    const url = `${ROBOT_SEND_URL}?key=${apikey}`
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
