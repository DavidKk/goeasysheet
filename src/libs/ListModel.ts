import { BasicModel } from './BasicModel'

export class ListModel extends BasicModel {
  static NAME = 'AnonymousListModel'

  protected get keyRows() {
    const sheet = this.getSheet()
    return sheet.getFrozenRows() || 1
  }

  protected get valueRows() {
    return this.keyRows + 1
  }

  public created() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet.getSheetByName(this.name)) {
      const activeSheet = spreadsheet.getActiveSheet()
      const sheets = spreadsheet.getSheets()
      const sheet = spreadsheet.insertSheet(this.name, sheets.length)
      const keys = this.fields.map((item) => item.name)
      const comments = this.fields.map((item) => item.comment || '')

      const range = sheet.getRange(1, 1, 1, keys.length)
      range.setHorizontalAlignment('center')
      range.setVerticalAlignment('middle')

      range.setValues([keys])
      range.setNotes([comments])

      sheet.setFrozenRows(1)

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

  /** 查询数据 */
  public select(keys = this.getKeys(), count = this.getSheet().getMaxRows()) {
    const ids = Array.from(
      function* (this: ListModel) {
        for (const filed of this.fields) {
          if (-1 !== keys.indexOf(filed.id)) {
            yield filed.id
          }
        }
      }.apply(this)
    )

    const range = this.getRange(this.valueRows, 1, count, this.fields.length)
    const metadata = range.getValues()
    const results = Array.from(
      function* (this: ListModel) {
        for (const row of metadata) {
          if (this.isEnd(row)) {
            break
          }

          yield Object.fromEntries(
            (function* () {
              for (let j = 0; j < row.length; j++) {
                const key: string = ids[j]
                const value = row[j]

                if (!(key && value)) {
                  break
                }

                yield [key, value]
              }
            })()
          )
        }
      }.apply(this)
    )

    return results
  }
}
