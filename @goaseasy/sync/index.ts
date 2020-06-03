import findIndex from 'lodash/findIndex'
import without from 'lodash/without'
import uniqBy from 'lodash/uniqBy'
import { useMenu, useTrigger } from '@goaseasy/core/decorators/extension'
import CacheSheetModel from '@goaseasy/core/libs/CacheSheetModel'
import Extension from '@goaseasy/core/libs/Extension'
import SyncModel from './models/Sync'
import * as Types from './types/sync'

@useMenu('同步助手')
export default class Sync extends Extension {
  protected mSync: SyncModel
  protected mCache: CacheSheetModel

  constructor() {
    super()

    this.mSync = new SyncModel()
    this.mCache = new CacheSheetModel()
  }

  @useMenu('安装')
  public created(): void {
    super.created()

    this.mSync.created()
    this.mCache.created()
  }

  @useMenu('同步数据')
  @useTrigger('minutely')
  public sync(): void {
    const now = Date.now()
    const token = 'excute@sync'
    const cache = this.mCache.get(token)
    const { lasttime = -Infinity } = cache || {}

    const tasks = this.mSync.fetchTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    const collections: { [key: string]: string[][] } = {}
    tasks.forEach(({ sheet: sheetName, fields, url, interval, filter }) => {
      if (now < lasttime + interval) {
        return
      }

      const collection = this.fetchFields(fields, url, filter)
      if (Array.isArray(collection) && collection.length > 0) {
        if (!Array.isArray(collections[sheetName])) {
          collections[sheetName] = []
        }

        collections[sheetName] = collections[sheetName].concat(collection)
      }
    })

    Object.keys(collections).forEach((sheetName) => {
      const sheet = this.getSheet(sheetName)
      const keyRow = sheet.getFrozenRows() || 1
      const valueRow = keyRow + 1
      const collection = collections[sheetName]
      const range = sheet.getRange(valueRow, 1, sheet.getMaxRows(), sheet.getMaxColumns())
      range.setValue('')

      uniqBy(collection, (item) => item.join('')).forEach((values, index) => {
        if (Array.isArray(values) && values.length > 0) {
          const row = index + valueRow
          const range = sheet.getRange(row, 1, 1, values.length)
          range.setValues([values])
        }
      })
    })

    this.mCache.set(token, { lasttime: now })
  }

  @useMenu('卸载')
  public destroy(ui: boolean = true): void {
    if (ui) {
      if (!this.confirm('确认卸载')) {
        return
      }
    }

    super.destroy()
    this.mSync.destroy()
    this.mCache.destroy()

    ui && this.toast('卸载成功')
  }

  public fetchFields(fields: string[], url: string, filterString: string): string[][] {
    const spreadsheet = SpreadsheetApp.openByUrl(url)
    const sheets = spreadsheet.getSheets()

    let filter: Types.Filter = {}
    try {
      filter = JSON.parse(filterString)
    } catch (error) {
      // nothing todo...
    }

    let results: string[][] = []
    sheets.forEach((sheet) => {
      const keyRow = sheet.getFrozenRows() || 1
      const valueRow = keyRow + 1
      const sheetFields = this.getSheetFields(sheet)

      if (without(fields, ...sheetFields).length === 0) {
        const cols = fields.map((field) => sheetFields.indexOf(field))
        const overTimeFilterCols = Array.isArray(filter.overtime) ? filter.overtime.map((field) => sheetFields.indexOf(field)) : []
        const count = sheet.getMaxRows()
        const range = sheet.getRange(valueRow, 1, count, sheetFields.length)
        const values = range
          .getValues()
          // 过滤空白行
          .filter((item) => item.join('').trim() !== '')
          // 时间过滤器
          .filter((item) => -1 !== findIndex(overTimeFilterCols, (col) => item[col] > Date.now()))

        const result = values.map((item) => cols.map((col) => item[col] || ''))
        results = results.concat(result)
      }
    })

    SpreadsheetApp.flush()
    return results
  }
}
