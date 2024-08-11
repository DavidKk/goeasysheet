import { Sheet } from './Sheet'

export interface BasicModelField {
  id: string
  name: string
  comment?: string
}

export class BasicModel extends Sheet {
  static NAME = 'AnonymousModel'

  protected name: string
  protected fields: BasicModelField[]

  constructor(name: string, fields: BasicModelField[]) {
    super()

    this.name = name
    this.fields = fields
  }

  protected getKeys() {
    return this.fields.map((item) => item.id)
  }

  protected getSheet(name: string = this.name, spreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
    return super.getSheet(name, spreadsheet)
  }

  protected getRange(row: number, column: number, sheet?: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range
  protected getRange(row: number, column: number, numRows: number, sheet?: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range
  protected getRange(row: number, column: number, numRows: number, numColumns: number, sheet?: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range
  protected getRange(a1Notation: string, sheet?: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range
  protected getRange(...args: any[]): GoogleAppsScript.Spreadsheet.Range {
    let sheet: GoogleAppsScript.Spreadsheet.Sheet = args[args.length - 1]
    if (typeof sheet === 'number') {
      sheet = this.getSheet()
      return sheet.getRange.apply(sheet, args as [any])
    }

    const params = args.slice(0, args.length - 1)
    return sheet.getRange.apply(sheet, ...(params as [any]))
  }

  /**
   * 判断是否为底部
   * @param rowdata 行数据
   * @param keys 数据字段
   * @description
   * 因为无法遍历有效数据行,
   * 因此判断如果该行为空,
   * 则不需要往下遍历
   */
  protected isEnd(rowdata: { [key: string]: any }, keys: string[] = Object.keys(rowdata)) {
    return keys.filter((key) => rowdata[key]).length === 0
  }

  public destroy() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName(this.name)
    sheet && spreadsheet.deleteSheet(sheet)
    SpreadsheetApp.flush()
  }
}
