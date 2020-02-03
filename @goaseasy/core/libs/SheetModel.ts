export default class SheetModel {
  public name: string
  public fields: Goaseasy.ModelFileds

  constructor (name: string, fields: Goaseasy.ModelFileds) {
    this.name = name
    this.fields = fields
  }

  public isReady (): boolean {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    return !!spreadsheet.getSheetByName(this.name)
  }

  protected getSheet (): GoogleAppsScript.Spreadsheet.Sheet {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName(this.name)
    if (sheet === null) {
      throw new Error('Sheet is not found')
    }

    return sheet
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getRange (startRow: number, startCol: number, endRow?: number, endCol?: number): GoogleAppsScript.Spreadsheet.Range {
    const sheet = this.getSheet()
    // eslint-disable-next-line prefer-spread, prefer-rest-params
    return sheet.getRange.apply(sheet, arguments)
  }

  protected getKeys (): string[] {
    return this.fields.map(item => item.id)
  }

  protected isEnd (rowdata: { [key: string]: any }, keys: string[] = Object.keys(rowdata)): boolean {
    return keys.filter((key) => rowdata[key]).length === 0
  }

  public destroy (): void {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName(this.name)
    sheet && spreadsheet.deleteSheet(sheet)
    SpreadsheetApp.flush()
  }
}
