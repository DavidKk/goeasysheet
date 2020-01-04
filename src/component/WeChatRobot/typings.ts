export interface SettingModelFields {
  apikey: string
}

export interface RobotServiceSettings {
  apikey: string
}

export type RobotServiceMessageType = 'text' | 'markdown' | 'news'

export type RobotServiceSendMessageParams<T extends RobotServiceMessageType> = T extends 'text' ? {
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

export interface Clock {
  hours?: number
  minutes?: number
  seconds?: number
}

export interface ScheduleDayTime {
  day: number[]
  clock: Clock[] | Date[]
}

export interface ScheduleTask {
  content: string
  daytime: ScheduleDayTime | Date
}
