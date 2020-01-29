declare namespace WorkWeixinRobot {
  namespace Robot {
    interface Settings {
      apikey: string
    }

    type MessageType = 'text' | 'markdown' | 'news'

    type SendMessageParams<T extends MessageType> = T extends 'text' ? {
      msgtype: T
      text: {
        mentioned_list?: string[]
        mentioned_mobile_list?: string[]
        content: string
      }
    } :
    T extends 'markdown' ? {
      msgtype: T
      markdown: {
        content: string
      }
    } : 
    T extends 'news' ? {
      msgtype: T
      articles: Array<{
        title: string
        description?: string
        url: string
        picurl?: string
      }>
    } : null
  }
}
