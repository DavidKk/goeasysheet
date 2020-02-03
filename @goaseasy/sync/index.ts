import without from 'lodash/without'
import { useMenu, useTrigger } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import SyncModel from './models/Sync'

@useMenu('同步助手')
export default class Sync extends Extension {
  protected mSync: SyncModel

  constructor () {
    super()
    this.mSync = new SyncModel()
  }

  @useMenu('安装')
  public created (): void {
    super.created()

    this.mSync.created()
  }

  @useMenu('同步数据')
  @useTrigger('daily')
  public sync (): void {
    const tasks = this.mSync.fetchTasks()
    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      return
    }

    const collections: { [key: string]: string[][] } = {}
    tasks.forEach(({ sheet: sheetName, fields, url }) => {
      const collection = this.fetchDatas(fields, url)
      if (Array.isArray(collection) && collection.length > 0) {
        if (!Array.isArray(collections[sheetName])) {
          collections[sheetName] = []
        }
  
        collections[sheetName] = collections[sheetName].concat(collection)
      }
    })

    Object.keys(collections).forEach((sheetName) => {
      const sheet = this.getSheet(sheetName)
      const collection = collections[sheetName]
      const count = sheet.getMaxRows()
      const range = sheet.getRange(2, 1, count)
      range.setValue('')

      collection.forEach((values, index) => {
        if (Array.isArray(values) && values.length > 0) {
          const row = index + 2
          const range = sheet.getRange(row, 1, 1, values.length)
          range.setValues([values])
        }
      })
    })
  }

  @useMenu('卸载')
  public destroy (ui: boolean = true): void {
    if (ui) {
      if (!this.confirm('确认卸载')) {
        return
      }
    }

    super.destroy()
    this.mSync.destroy()

    ui && this.toast('卸载成功')
  }

  public fetchDatas (fields: string[], url: string): string[][] {
    const spreadsheet = SpreadsheetApp.openByUrl(url)
    const sheets = spreadsheet.getSheets()

    let results: string[][] = []
    sheets.forEach((sheet) => {
      const tFields = this.getSheetFields(sheet)
      if (without(fields, ...tFields).length === 0) {
        const cols = fields.map((field) => tFields.indexOf(field))
        const count = sheet.getMaxRows()
        const range = sheet.getRange(2, 1, count, fields.length)
        const values = range.getValues().filter((item) => item.join('') !== '')
        const result = values.map((item) => cols.map((col) => item[col] || ''))
        results = results.concat(result)
      }
    })

    SpreadsheetApp.flush()
    return results
  }
}
