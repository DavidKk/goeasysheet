import SheetModel from './SheetModel'

export default class CacheSheetModel extends SheetModel {
  constructor(name: string = 'Cache') {
    super(name, [])
  }

  public created(): void {
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

  protected getRangeValues(column: number, numColumns: number = 1): string[][] {
    const sheet = this.getSheet()
    const count = sheet.getMaxRows()
    const range = sheet.getRange(1, column, count, numColumns)
    const values = range.getValues()

    const results = []
    for (let i = 0; i < values.length; i++) {
      const data = values[i]
      if (data.join('') === '') {
        break
      }

      results.push(data)
    }

    return results
  }

  protected getKeys(): string[] {
    const values = this.getRangeValues(1, 1)
    const keys = []
    for (let i = 0; i < values.length; i++) {
      const item = values[i][0]
      item && keys.push(item)
    }

    return keys
  }

  protected getValues(): string[] {
    const values = this.getRangeValues(2, 1)
    const keys = []
    for (let i = 0; i < values.length; i++) {
      keys.push(values[i][0])
    }

    return keys
  }

  public get(name: string): any {
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

  public set(name: string, value: any): void {
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

  public del(name: string): void {
    const names = this.getKeys()
    const index = names.indexOf(name)
    if (-1 === index) {
      return null
    }

    const row = index + 1
    const sheet = this.getSheet()
    sheet.deleteRow(row)
  }
}
