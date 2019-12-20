Service('robot', {
  /**
   * 配置
   */
  settings: {
    /**
     * 企业微信机器人KEY
     */
    token: ''
  },
  /**
   * 配置
   * @param {Object} options 配置
   * @param {string} options.token 企业微信机器人KEY
   */
  configure: function (options) {
    options = options || {}
    utils.assign(WeChatRobot.settings, options)
  },
  /**
   * 发送信息
   */
  sendMessage: function (content, type, options) {
    type = type || 'text'
    options = options || {}
    
    var payload = {
      msgtype: type
    }
    
    payload[type] = {
      content: content
    }

    if (options.mentionedList) {
      utils.assign(payload[type], {
        mentioned_list: options.mentionedList
      })
    }

    if (options.mentionedMobileList) {
      utils.assign(payload[type], {
        mentioned_mobile_list: options.mentionedMobileList
      })
    }

    var url = ROBOT_SEND_URL + '?key=' + WeChatRobot.settings.token
    var params = {
      method: 'POST',
      payload: payload
    }

    var response = UrlFetchApp.fetch(url, params)
    var responseContent = response.getContentText("UTF-8")
    var responseData = JSON.parse(responseContent)

    var errcode = responseData.errcode
    var errmsg = responseData.errmsg
    if (errcode !== 0) {
      return errmsg
    }
  
    return true
  }
})
