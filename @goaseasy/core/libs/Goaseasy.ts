export default class Goaseasy {
  protected getSheet (name: string, spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet()): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = spreadsheet.getSheetByName(name)
    if (sheet === null) {
      throw new Error('Sheet is not found')
    }

    return sheet
  }

  protected getSheetFields (sheet: string | GoogleAppsScript.Spreadsheet.Sheet, row?: number): string[] {
    if (!sheet) {
      return []
    }

    if (typeof sheet === 'string') {
      sheet = this.getSheet(sheet)
    }

    if (typeof row !== 'number') {
      row = sheet.getFrozenRows() || 1
    }

    const count = sheet.getMaxColumns()
    const range = sheet.getRange(row, 1, 1, count)
    const values = range.getValues()
    const fields: string[] = []

    for (let i = 0; i < values.length; i ++) {
      const item = values[i]
      for (let j = 0; j < item.length; j ++) {
        if (!item[j]) {
          break;
        }

        fields.push(item[j])
      }
    }

    return fields
  }
}
