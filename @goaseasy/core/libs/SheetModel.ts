import Goaseasy from './Goaseasy'

export default class SheetModel extends Goaseasy {
  protected name: string
  protected fields: Goaseasy.ModelFileds

  constructor(name: string, fields: Goaseasy.ModelFileds) {
    super()

    this.name = name
    this.fields = fields
  }

  protected getKeys(): string[] {
    return this.fields.map((item) => item.id)
  }

  protected getSheet(name: string = this.name, spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet()): GoogleAppsScript.Spreadsheet.Sheet {
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
      // eslint-disable-next-line prefer-spread
      return sheet.getRange.apply(sheet, args)
    }

    const params = args.slice(0, args.length - 1)
    // eslint-disable-next-line prefer-spread
    return sheet.getRange.apply(sheet, params)
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
  protected isEnd(rowdata: { [key: string]: any }, keys: string[] = Object.keys(rowdata)): boolean {
    return keys.filter((key) => rowdata[key]).length === 0
  }

  public destroy(): void {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName(this.name)
    sheet && spreadsheet.deleteSheet(sheet)
    SpreadsheetApp.flush()
  }
}
