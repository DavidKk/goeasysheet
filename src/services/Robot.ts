class RobotService {
  private settings: RobotSettings

  public configure (options: Optional<RobotSettings> = {}): void {
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
    const url = `${ROBOT_SEND_URL}?key=?key=${this.settings.apiToken}`
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

interface RobotSettings {
  apiToken: string
}
