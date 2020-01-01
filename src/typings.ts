// Helpers
type Get<data extends { [key: string]: any }, T extends string> = data[T]
type Optional<T> = { [K in keyof T]?: T[K] }

interface GoogleRun {
  withSuccessHandler: (response: any) => this
  withFailureHandler: (response: any) => this
  withUserObject: (object: Object) => this
  bridge: (namespace: string, ...args: any[]) => this
}

declare var google: {
  script: {
    run: GoogleRun
  }
}

type ModelFileds = Array<{
  id: string
  name: string
}>

interface WeChatRobotSettingModelFields {
  version: string
  robotApiKey: string
}

type RobotSendMessageType = 'text' | 'markdown' | 'news'
type RobotSendMessageParams<T extends RobotSendMessageType> = T extends 'text' ? {
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
