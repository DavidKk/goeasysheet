import { BasicModel } from './BasicModel'

export class KVModel extends BasicModel {
  static NAME = 'AnonymousKVModel'

  protected get keyCol() {
    const sheet = this.getSheet()
    return sheet.getFrozenColumns() || 1
  }

  protected get valueCol() {
    return this.keyCol + 1
  }

  public created() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (spreadsheet.getSheetByName(this.name)) {
      return
    }

    const activeSheet = spreadsheet.getActiveSheet()
    const sheets = spreadsheet.getSheets()
    const sheet = spreadsheet.insertSheet(this.name, sheets.length)
    const keys = this.fields.map((item) => item.name)
    const comments = this.fields.map((item) => item.comment || '')

    const range = sheet.getRange(1, 1, keys.length)
    range.setHorizontalAlignment('center')
    range.setVerticalAlignment('middle')

    range.setValues(keys.map((key) => [key]))
    range.setNotes(comments.map((comment) => [comment]))

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

  protected getKeyRange(start: number, end: number) {
    start = start || 1
    end = end || this.fields.length
    return this.getRange(start, this.keyCol, end)
  }

  protected getValueRange(start?: number, end?: number) {
    start = start || 1
    end = end || this.fields.length
    return this.getRange(start, this.valueCol, end)
  }

  public getValues() {
    const values = this.getValueRange().getValues()
    const fileds = this.fields.map((item) => item.id)
    const result = Object.fromEntries(
      (function* () {
        for (let i = 0; i < fileds.length; i++) {
          const id = fileds[i]
          yield [id, values[i][0]]
        }
      })()
    )

    return result
  }

  public get(key: string) {
    const index = this.fields.findIndex(({ id }) => id === key)
    if (-1 === index) {
      return null
    }

    const row = index + 1
    const range = this.getRange(row, this.valueCol)
    const item = range.getValues()
    return item[0]
  }

  public set(key: string, value: any) {
    const index = this.fields.findIndex(({ id }) => id === key)
    if (-1 === index) {
      return
    }

    const row = index + 1
    const range = this.getRange(row, this.valueCol)
    range.setValues([value])

    SpreadsheetApp.flush()
  }

  public multiSet(data: Record<string, any>) {
    const originValues = this.getValues()
    const metadata = this.fields.map((filed) => {
      const key = filed.id
      const value = data[key]
      return typeof value === 'undefined' ? [originValues[key]] : [value]
    })

    const range = this.getValueRange()
    range.setValues(metadata)
  }
}
