class KeyvalueSheetModel extends SheetModel {
  constructor (name: string, fields: ModelFileds) {
    super(name, fields)

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet.getSheetByName(this.name)) {
      const activeSheet = spreadsheet.getActiveSheet()
      const sheets = spreadsheet.getSheets()
      const sheet = spreadsheet.insertSheet(this.name, sheets.length)
      const keys = fields.map(item => item.name)

      const range = sheet.getRange(1, 1, 1, keys.length)
      range.setHorizontalAlignment('center')
      range.setFontSize(12)
      range.setFontWeight('bold')
      range.setFontColor('#ffffff')
      range.setBackground('#22538f')
      range.setValues([fields])

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

  protected getKeyRange (start: number, end: number): GoogleAppsScript.Spreadsheet.Range {
    start = start || 1
    end = end || this.fields.length
    return this.getRange(start, 1, end)
  }

  protected getValueRange (start?: number, end?: number): GoogleAppsScript.Spreadsheet.Range {
    start = start || 1
    end = end || this.fields.length
    return this.getRange(start, 2, end)
  }

  public getValues (): { [key: string] : any } {
    const values = this.getValueRange().getValues()
    const fileds = this.fields.map((item) => item.name)
    const result: { [key: string] : any } = {}

    for (let i = 0; i < fileds.length; i ++) {
      const name = fileds[i]
      result[name] = values[i][0]
    }
  
    return result
  }

  public get (key: string): any {
    var index = findIndex(this.fields, { id: key })
    if (-1 === index) {
      return null
    }
  
    var row = index + 1
    var range = this.getRange(row, 2)
    var item = range.getValues()
    return item[0]
  }

  public set (key: string, value: any): void {
    const index = findIndex(this.fields, { id: key })
    if (-1 === index) {
      return
    }
  
    const row = index + 1
    const range = this.getRange(row, 2)
    range.setValues([value])
  
    SpreadsheetApp.flush()
  }

  public multiSet (values: { [key: string]: any }): void {
    const metadata = this.fields.map((filed) => {
      const value = values[filed.id]
      return [value]
    })
  
    const range = this.getValueRange()
    range.setValues(metadata)
  }
}
