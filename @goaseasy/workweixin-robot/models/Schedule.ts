import ListSheetModel from '@goaseasy/core/libs/ListSheetModel'
import { sub, mul } from '@goaseasy/core/utils/math'
import { parseGMTHours, parseGMTSeconds } from '@goaseasy/core/utils/datetime'
import { Days } from '../constants/day'
import * as Typings from '../types/schedule'

export default class ScheduleModel extends ListSheetModel {
  constructor () {
    super('企业微信机器人', [
      {
        id: 'task',
        name: '任务名称',
        comment: '字符串; 对应数据表名称; 例如: 微信提醒'
      },
      {
        id: 'content',
        name: '发送内容',
        comment: '字符串; 对应数据表中发送内容的引用; 例如: !A1:A'
      },
      {
        id: 'datetime',
        name: '执行时间',
        comment: '字符串; 对应数据表中发送时间的引用; 例如: !B1:B'
      },
      {
        id: 'apikey',
        name: 'API_KEY',
        comment: '字符串; 企业微信机器人提供的 API KEY'
      },
      {
        id: 'type',
        name: '触发类型',
        comment: '枚举类型; 决定时间触发时机; daily: 每日触发, minutely: 每几分钟触发'
      },
      {
        id: 'extra',
        name: '其他字段',
        comment: 'JSON字符串; 对应数据表中横向字段引用: 例如: {"id":"!A2:A"}'
      },
      {
        id: 'messageType',
        name: '模板类型',
        comment: '枚举类型; 具体参考机器人相关信息; text: 文本(默认), markdown: Markdown 标记语言'
      },
      {
        id: 'template',
        name: '消息模板',
        comment: '字符串; 发送消息模板, 可通过变量替换数据, 使用的模板引擎为 Handlebars; 例如: {{#each this}}{{content}}{{/each}}'
      }
    ])
  }

  public fetchTasks <T extends Typings.ScheduleType>(type?: T): Array<Typings.Schedule<T>> {
    const rows = this.select()
    if (rows.length === 0) {
      return []
    }

    const tasks: Array<Typings.Schedule<T>> = []
    for (let i = 0; i < rows.length; i ++) {
      const item = rows[i]
      const {
        task: sheetName,
        content: contentA1N,
        datetime: datetimeA1N,
        apikey,
        type: triggerType,
        extra: jsonExtraDataWithA1N,
        messageType,
        template
      } = item

      /**
       * 因为无法遍历有效数据行,
       * 因此判断如果该行为空,
       * 则不需要往下遍历
       */
      if (Object.keys(item).filter((key) => item[key]).length === 0) {
        break
      }

      if (type && triggerType !== type) {
        continue
      }

      if (!(sheetName && contentA1N && datetimeA1N && type && apikey)) {
        continue
      }

      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
      const sheet = spreadsheet.getSheetByName(sheetName)

      const contents = sheet.getRange(contentA1N).getValues()
      const datetimes = sheet.getRange(datetimeA1N).getValues()

      let extraNames = []
      let extraValues = []
      if (typeof jsonExtraDataWithA1N === 'string' && jsonExtraDataWithA1N.length > 0) {
        try {
          const extraDataWithA1N = JSON.parse(jsonExtraDataWithA1N)
          extraNames = Object.keys(extraDataWithA1N)
          extraValues = extraNames.map((name) => {
            const valueA1N = extraDataWithA1N[name]
            return sheet.getRange(valueA1N).getValues()
          })
        } catch (error) {
          // nothing todo...
        }
      }

      /**
       * 整合引用值
       */
      for (let i = 0; i < contents.length; i ++) {
        const content = contents[i][0]
        const daytime = datetimes[i][0]
        const extra = {}
        extraNames.forEach((name, index) => {
          const value = extraValues[index]
          extra[name] = value[i][0]
        })

        if (!content && !daytime) {
          break
        }

        if (!(content && daytime)) {
          continue
        }

        const datetime = this.convertDayTime(daytime, triggerType) as any
        if (!(content && datetime)) {
          continue
        }

        tasks.push({ content, datetime, apikey, type, extra, messageType, template })
      }
    }

    return tasks
  }

  protected convertDayTime <T extends Typings.ScheduleType>(datetime: Date | string, type: T): Typings.ScheduleDatetime<T> {
    switch (type) {
      case 'daily':
        return this.convertSpecifiedDateTime(datetime) as any
      case 'minutely':
        return this.convertPeriodicDateTime(datetime) as any
    }
  }

  /**
   * 转化成指定的任务时间格式
   * @param datetime 时间
   */
  protected convertSpecifiedDateTime (datetime: Date | string): Typings.ScheduleSpecifiedDateTime {
    const dates = []
    if (datetime instanceof Date) {
      if (datetime.getTime() < 0) {
        return { dates }
      }

      const year = datetime.getFullYear()
      const month = datetime.getMonth() + 1
      const date = datetime.getDate()
      dates.push({ year, month, date })

      return { dates }
    }

    if (typeof datetime === 'string') {
      const regexp = /^(?:(\d{4})[-/])?(\d{1,2})[-/](\d{1,2})$/
      const datetimes = datetime.split(/[;,|]/)

      datetimes.forEach((date) => {
        const matched = regexp.exec(date)

        if (matched) {
          const year = parseInt(matched[1], 10)
          const month = parseInt(matched[2], 10)
          const date = parseInt(matched[3], 10)
          dates.push({ year, month, date })
        }
      })
    }

    return { dates }
  }

  /**
   * 转化成周期性任务时间格式
   * @param datetime 时间
   */
  protected convertPeriodicDateTime (datetime: Date | string): Typings.SchedulePeriodicDateTime {
    if (datetime instanceof Date) {
      const days = []
      if (datetime.getTime() < 0) {
        const { hours, minutes, seconds } = this.convertTime(datetime)
        const clocks = [{ hours, minutes, seconds }]
        return { days, clocks }
      }

      const hours = datetime.getHours()
      const minutes = datetime.getMinutes()
      const seconds = datetime.getSeconds()
      const clocks = [{ hours, minutes, seconds }]
      return { days, clocks }
    }

    if (typeof datetime === 'string') {
      const regexp = /^((?:\d{2}:\d{2},?)+)(?:\/((?:(?:Weekday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?)+))?$/i
      const matched = regexp.exec(datetime)

      if (matched) {
        const [, matchedTimes, matchedDays] = matched

        let dayString: string[] = matchedDays ? matchedDays.split(',').filter((v) => v) : []
        if (dayString.length === 0) {
          dayString = [].concat(Days)
        } else if (-1 !== dayString.indexOf('Weekday')) {
          dayString = Days.slice(1, 6)
        }

        const days = dayString.map((name: string) => Days.indexOf(name)).filter((index) => -1 !== index)
        const clocks = matchedTimes.split(',').map((time) => {
          const [hours, minutes, seconds] = time.split(':')
          return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10), seconds: parseInt(seconds, 10) }
        })
  
        return { days, clocks }
      }
    }
  }

  protected convertTime (datetime: Date): Typings.ScheduleClock {
    const seconds = parseGMTSeconds(datetime)
    const floatHours = parseGMTHours(datetime)
    const hours = Math.floor(floatHours)
    const decimal = sub(floatHours, hours)
    const minutes = Math.floor(mul(decimal, 60))
    return { hours, minutes, seconds }
  }
}
