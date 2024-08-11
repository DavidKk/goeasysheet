import { ListModel } from '@/libs/ListModel'

/** 名称 */
const MODEL_NAME = '同步助手'

const DTO_TASK_NAME = {
  id: 'sheet',
  name: '任务名称',
  comment: '字符串; 对应数据表名称',
}

const DTO_URL = {
  id: 'url',
  name: '需同步数据表',
  comment: '字符串; Spreadsheets URL 地址; https://docs.google.com/spreadsheets/d/xxx/edit',
}

const DTO_INTERVAL = {
  id: 'interval',
  name: '间隔时间',
  comment: '数字; 同步间隔时间, 单位(分)',
}

const DTO_FILTER = {
  id: 'filter',
  name: '过滤条件',
  comment: '同步条件; 例如: {"overtime": [名字1, 名字2]}',
}

export type SyncTask = {
  sheet: string
  fields: string[]
  url: string
  interval: number
  filter: string
}

export type Filter = {
  overtime?: string[]
}

export default class SyncModel extends ListModel {
  static NAME = 'SyncModel'

  constructor() {
    super(MODEL_NAME, [DTO_TASK_NAME, DTO_URL, DTO_INTERVAL, DTO_FILTER])
  }

  public fetchTasks() {
    const rows = this.select()
    if (rows.length === 0) {
      return []
    }

    const g = function* (this: SyncModel) {
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i] || {}
        const { sheet: name, url, interval, filter } = item

        if (this.isEnd(item)) {
          break
        }

        if (!(name && url)) {
          continue
        }

        const sheet = this.getSheet(name)
        const fields = this.getSheetFields(sheet)
        yield { sheet: name, fields, url, interval, filter }
      }
    }

    return Array.from(g.apply(this))
  }
}
