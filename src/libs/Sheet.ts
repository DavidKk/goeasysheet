import { getLogger } from '@/services/logger'

export interface GetSheetFieldsOptions {
  /** 行，默认第一行 */
  row?: number
  /** 尾列索引，默认最大列数 */
  endCol?: number
}

export class Sheet {
  static NAME = 'AnonymousSheet'

  public get alias() {
    const { NAME = Sheet.NAME } = Object.getPrototypeOf(this)?.constructor
    return NAME
  }

  protected get logger() {
    return getLogger(this.alias)
  }

  constructor() {
    this.logger.info(`${this.alias} initialize.`)
  }

  /** 获取表格 */
  protected getSheet(name: string, spreadsheet = SpreadsheetApp.getActiveSpreadsheet()) {
    const sheet = spreadsheet.getSheetByName(name)
    if (sheet === null) {
      throw new Error(`Sheet "${name}" is not found`)
    }

    return sheet
  }

  /** 获取表格中的数据 */
  protected getSheetFields(sheet: string | GoogleAppsScript.Spreadsheet.Sheet, options?: GetSheetFieldsOptions) {
    if (!sheet) {
      this.logger.warn('Sheet is not found')
      return []
    }

    if (typeof sheet === 'string') {
      sheet = this.getSheet(sheet)
    }

    const startRow = typeof options?.row === 'number' ? options.row : sheet.getFrozenRows() || 1
    const endCol = typeof options?.endCol === 'number' ? options.endCol : sheet.getMaxColumns()
    const range = sheet.getRange(startRow, 1, 1, endCol)
    const rows = range.getValues()
    return this.flattenToStringArray(rows)
  }

  /** 查询 */
  protected query(formula: string) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.insertSheet()
    sheet.getRange(1, 1).setFormula(formula)

    const result: string[][] = sheet.getDataRange().getValues()
    spreadsheet.deleteSheet(sheet)
    SpreadsheetApp.flush()

    return result
  }

  /** 打平二维数组并将数据转成字符串 */
  protected flattenToStringArray(values: any[][]) {
    return Array.from(
      (function* () {
        for (const columns of values) {
          for (const value of columns) {
            // 断"列"退出，必须连续
            if (!value) {
              break
            }

            // 非字符串都转策划给你字符串
            if (typeof value !== 'string') {
              yield Object.toString.call(value)
              continue
            }

            yield value
          }
        }
      })()
    )
  }
}
