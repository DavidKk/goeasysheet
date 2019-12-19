var KvModel = function (table, fileds) {
  this.name = table
  this.fileds = fileds
  this.isInstalled = this.getSheet() !== null

  this.install(fileds)
}

KvModel.prototype.getSheet = function () {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  return spreadsheet.getSheetByName(this.name)
}

KvModel.prototype.install = function (fileds) {
  if (this.isInstalled !== false) {
    return this
  }

  if (!Array.isArray(fileds)) {
    fileds = []
  }

  var activeSheet = spreadsheet.getActiveSheet()
  var sheets = spreadsheet.getSheets()
  var sheet = spreadsheet.insertSheet(this.name, sheets.length)
  var keys = fileds.map(function (filed) {
    return filed.name
  })

  var range = sheet.getRange(1, 1, keys.length, 1)
  range.setHorizontalAlignment('center')
  range.setFontSize(12)
  range.setFontWeight('bold')
  range.setFontColor('#ffffff')
  range.setBackground('#22538f')
  range.setValues([fileds])

  sheet.setFrozenColumns(1)

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

  this.fileds = fileds
  return this
}

KvModel.prototype.getKeys = function () {
  if (this.isInstalled !== true) {
    throw new Error('Model is not install')
  }

  var range = this.getSheet().getRange(1, 1, fileds.length)
  return range.getValues().map(function (item) {
    return item[0]
  })
}

KvModel.prototype.getValues = function () {
  var result = {}
  var range = this.getSheet().getRange(1, 1, fileds.length, 1)
  var datas = range.getValues()

  for (var row = 0; row < datas.length; row ++) {
    var data = datas[row]
    var name = data[0]
    var value = data[1]

    if (name) {
      result[name] = value
    }
  }

  return result
}

KvModel.prototype.get = function (key) {
  var index = Utils.findIndex(this.fileds, function (filed) {
    return filed.id === key
  })

  if (-1 === index) {
    return null
  }

  var row = index + 1
  var range = this.getSheet().getRange(row, 2)
  var item = range.getValues()
  return item[0]
}

KvModel.prototype.set = function (key, value) {
  var index = Utils.findIndex(this.fileds, function (filed) {
    return filed.id === key
  })

  if (-1 === index) {
    return
  }

  var row = index + 1
  var range = this.getSheet().getRange(row, 2)
  range.setValues([value])

  SpreadsheetApp.flush()
}
