import SheetModel from './SheetModel'
import * as GASTypings from '../typings.gas'

export default class ListSheetModel extends SheetModel {
  constructor (name: string, fields: GASTypings.ModelFileds) {
    super(name, fields)

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet.getSheetByName(this.name)) {
      const activeSheet = spreadsheet.getActiveSheet()
      const sheets = spreadsheet.getSheets()
      const sheet = spreadsheet.insertSheet(this.name, sheets.length)
      const keys = fields.map(item => item.name)

      const range = sheet.getRange(1, 1, 1, keys.length)
      range.setHorizontalAlignment('center')
      range.setValues([keys])
      
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

  public select (keys: string[] = this.getKeys(), count: number = this.getSheet().getMaxRows()): Array<{ [key: string]: any }> {
    const ids = this.fields.map((filed) => {
      if (-1 !== keys.indexOf(filed.id)) {
        return filed.id
      }
    })

    const range = this.getRange(2, 1, count, this.fields.length)
    const metadata = range.getValues()
    const results = []

    for (let i = 0; i < metadata.length; i ++) {
      const row = metadata[i]
      if (row.filter((item) => item).length === 0) {
        break
      }

      const data: { [key: string]: any } = {}
      for (let j = 0; j < row.length; j ++) {
        const key = ids[j]
        const value = row[j]
  
        if (!(key && value)) {
          break
        }

        data[key] = value
      }
  
      results.push(data)
    }
  
    return results
  }
}
