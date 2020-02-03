import ListSheetModel from '@goaseasy/core/libs/ListSheetModel'
import * as Typings from '../types/sync'

export default class SyncModel extends ListSheetModel {
  constructor () {
    super('同步助手', [
      {
        id: 'sheet',
        name: '任务名称',
        comment: '字符串; 对应数据表名称'
      },
      {
        id: 'url',
        name: '需同步数据表',
        comment: '字符串; Spreadsheets URL 地址; https://docs.google.com/spreadsheets/d/xxx/edit'
      }
    ])
  }

  public fetchTasks (): Typings.SyncTask[] {
    const rows = this.select()
    if (rows.length === 0) {
      return []
    }

    Logger.log(rows)

    const results: Typings.SyncTask[] = []
    for (let i = 0; i < rows.length; i ++) {
      const item = rows[i] || {}
      const { sheet: name, url } = item

      if (this.isEnd(item)) {
        break
      }

      if (!(name && url)) {
        continue
      }

      const sheet = this.getSheet(name)
      const fields = this.getSheetFields(sheet)
      results.push({ sheet: name, fields, url })
    }

    return results
  }
}
