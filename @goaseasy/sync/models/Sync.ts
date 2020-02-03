import ListSheetModel from '@goaseasy/core/libs/ListSheetModel'
import * as Typings from '../types/sync'

export default class SyncModel extends ListSheetModel {
  constructor () {
    super('同步助手', [
      {
        id: 'sheet',
        name: '容器表明',
        comment: '字符串; 对应数据表名称; 例如: 微信提醒'
      },
      {
        id: 'url',
        name: '需同步数据表',
        comment: '字符串; Spreadsheets URL 地址; https://docs.google.com/spreadsheets/d/xxx/edit'
      }
    ])
  }

  public fetch (): Typings.SyncTask[] {
    const rows = this.select()
    if (rows.length === 0) {
      return []
    }

    const tasks: Typings.SyncTask[] = []
    for (let i = 0; i < rows.length; i ++) {

    }

    return tasks
  }
}
