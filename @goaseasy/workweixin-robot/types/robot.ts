export interface Settings {
  apikey: string
}

export type MessageType = 'text' | 'markdown' | 'news'

export type SendMessageParams<T extends MessageType> = T extends 'text'
  ? {
      msgtype: T
      text: {
        mentioned_list?: string[]
        mentioned_mobile_list?: string[]
        content: string
      }
    }
  : T extends 'markdown'
  ? {
      msgtype: T
      markdown: {
        content: string
      }
    }
  : T extends 'news'
  ? {
      msgtype: T
      articles: Array<{
        title: string
        description?: string
        url: string
        picurl?: string
      }>
    }
  : null
