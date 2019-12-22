class ListSheetModel extends SheetModel {
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

  public select (keys: string[], count: number): Array<{ [key: string]: any }> {
    count = count || this.getSheet().getMaxRows()

    const range = this.getRange(2, this.fields.length, count)
    const metadata = range.getValues()
    const results = []
  
    const validkeys = keys.length === 0 ? this.getKeys() : this.fields.map((filed) => {
      if (-1 !== keys.indexOf(filed.id)) {
        return filed.id
      }
    })
  
    for (let row = 0; row < metadata.length; row ++) {
      let data: { [key: string]: any } = {}
      for (let col = 0; col < metadata[row].length; col ++) {
        const key = validkeys[col]
        const value = metadata[row][col]
  
        if (key) {
          data[key] = value
        }
      }
  
      results.push(data)
    }
  
    return results
  }
}
