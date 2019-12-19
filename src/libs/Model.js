var Model = {
  /**
   * 创建表
   * @param {Object} table
   * @param {string} table.type 表类型
   * @param {string} table.name 表名称
   * @param {Array<{ name: string }>} [table.columns] 字段名
   * @param {Array<{ name: string }>} [table.rows] 字段名
   */
  createTable: function (table) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName(table.name)
    if (sheet != null) {
      return
    }

    var activeSheet = spreadsheet.getActiveSheet()
    var sheets = spreadsheet.getSheets()
    sheet = spreadsheet.insertSheet(table.name, sheets.length)

    /**
     * 写入字段
     */
    var fileds = table.columns.map(function (item) {
      return item.name
    })

    var range = sheet.getRange(1, 1, 1, fileds.length)
    range.setHorizontalAlignment('center')
    range.setFontSize(12)
    range.setFontWeight('bold')
    range.setFontColor('#ffffff')
    range.setBackground('#22538f')
    range.setValues([fileds])
    sheet.setFrozenRows(1)

    /**
     * 设置仅自身具有编辑权限
     */
    var protection = sheet.protect().setDescription('数据受保护')
    var me = Session.getEffectiveUser()
    protection.addEditor(me)
    protection.removeEditors(protection.getEditors())
    protection.canDomainEdit() && protection.setDomainEdit(false)

    spreadsheet.setActiveSheet(activeSheet)
    SpreadsheetApp.flush()
  }
}
