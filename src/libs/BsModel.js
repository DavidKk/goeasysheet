var BsModel = oo.class(function (table, fileds) {
  this.name = table
  this.fileds = fileds
  this.isInstalled = this.getSheet() !== null
}, {
  getSheet = function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    return spreadsheet.getSheetByName(this.name)
  },
  getRange = function (startRow, startCol, endRow, endCol) {
    return this.getSheet().getRange(startRow, startCol, endRow, endCol)
  },
  getKeys = function () {
    return this.fileds.map(function (filed) {
      return filed.id
    })
  },
  destroy = function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName(this.name)
    sheet && spreadsheet.deleteSheet(sheet)
    SpreadsheetApp.flush()
  }
})
