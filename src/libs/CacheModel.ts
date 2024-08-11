import { BasicModel } from './BasicModel'

export default class CacheModel extends BasicModel {
  static NAME = 'AnonymousCacheModel'

  constructor(name = 'Cache') {
    super(name, [])
  }

  public created() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet.getSheetByName(this.name)) {
      const activeSheet = spreadsheet.getActiveSheet()
      const sheets = spreadsheet.getSheets()
      const sheet = spreadsheet.insertSheet(this.name, sheets.length)
      sheet.setFrozenColumns(1)

      /**
       * 设置仅自身具有编辑权限
       */
      const protection = sheet.protect().setDescription('数据受保护')
      const me = Session.getEffectiveUser()
      protection.addEditor(me)
      protection.removeEditors(protection.getEditors())
      protection.canDomainEdit() && protection.setDomainEdit(false)

      spreadsheet.setActiveSheet(activeSheet)
      SpreadsheetApp.flush()
    }
  }

  protected getRangeValues(column: number, numColumns = 1) {
    const sheet = this.getSheet()
    const count = sheet.getMaxRows()
    const range = sheet.getRange(1, column, count, numColumns)
    const values = range.getValues()
    const results = Array.from(
      (function* () {
        for (const data of values) {
          if (data.join('') === '') {
            break
          }

          yield data
        }
      })()
    )

    return results
  }

  protected getKeys() {
    const rangeValues = this.getRangeValues(1, 1)
    const keys = Array.from(
      (function* () {
        for (const value of rangeValues) {
          const item = value[0]
          if (!item) {
            continue
          }

          if (typeof item !== 'string') {
            yield Object.toString.call(item)
            continue
          }

          yield item
        }
      })()
    )

    return keys
  }

  protected getValues() {
    const rangeValues = this.getRangeValues(2, 1)
    const values = Array.from(
      (function* () {
        for (const value of rangeValues) {
          yield value[0]
        }
      })()
    )

    return values
  }

  public get(name: string) {
    const names = this.getKeys()
    const index = names.indexOf(name)
    if (-1 === index) {
      return null
    }

    const row = index + 1
    const sheet = this.getSheet()
    const range = sheet.getRange(row, 2)
    const value = range.getValue()

    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  public set(name: string, value: any) {
    const names = this.getKeys()
    const index = names.indexOf(name)
    const row = (-1 === index ? this.getKeys().length : index) + 1
    const sheet = this.getSheet()
    const range = sheet.getRange(row, 1, 1, 2)

    try {
      const json = JSON.stringify(value)
      range.setValues([[name, json]])
    } catch (error) {
      range.setValues([[name, value]])
    }
  }

  public del(name: string) {
    const names = this.getKeys()
    const index = names.indexOf(name)
    if (-1 === index) {
      return
    }

    const row = index + 1
    const sheet = this.getSheet()
    sheet.deleteRow(row)
  }
}
