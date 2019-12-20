Module('KvModel', ['BsModel'], function (BsModel) {
  return oo.inherit(BsModel, {
    getKeyRange: function (start, end) {
      start = start || 1
      end = end || this.fileds.length
      return this.getRange(start, 1, end)
    },
    getValueRange: function (start, end) {
      start = start || 1
      end = end || this.fileds.length
      return this.getRange(start, 2, end)
    },
    install: function (fileds) {
      if (this.isInstalled !== false) {
        return this
      }
    
      if (!Array.isArray(fileds)) {
        fileds = []
      }
    
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
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
    },
    getValues: function () {
      var result = {}
      var values = this.getValueRange().getValues()
      for (var i = 0; i < fileds.length; i ++) {
        var name = fileds[i]
        result[name] = values[i][0]
      }
    
      return result
    },
    get: function (key) {
      var index = utils.findIndex(this.fileds, { id: key })
      if (-1 === index) {
        return null
      }
    
      var row = index + 1
      var range = this.getRange(row, 2)
      var item = range.getValues()
      return item[0]
    },
    set: function (key, value) {
      var index = utils.findIndex(this.fileds, { id: key })
      if (-1 === index) {
        return
      }
    
      var row = index + 1
      var range = this.getRange(row, 2)
      range.setValues([value])
    
      SpreadsheetApp.flush()
    },
    multiSet: function (values) {
      var metadata = this.fileds.map(function (filed) {
        var value = values[filed.id]
        return [value]
      })
    
      var range = this.getValueRange()
      range.setValues(metadata)
    }
  })
})
