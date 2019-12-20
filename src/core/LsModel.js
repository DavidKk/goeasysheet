Module('LsModel', ['BsModel'], function (BsModel) {
  return oo.inherit(BsModel, {
    install: function (fileds) {
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
    
      var range = sheet.getRange(1, 1, 1, keys.length)
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
    
      this.fileds = fileds
      return this
    },
    select: function (keys, count) {
      count = count || this.getSheet().getMaxRows()
    
      var range = this.getRange(2, this.fileds.length, count)
      var metadata = range.getValues()
      var results = []
    
      keys = Array.isArray(keys) ? this.getKeys() : this.fileds.map(function (filed) {
        if (-1 !== keys.indexOf(filed.id)) {
          return filed.id
        }
      })
    
      for (var row = 0; row < metadata.length; row ++) {
        var data = {}
        for (var col = 0; col < metadata[row].length; col ++) {
          var key = keys[col]
          var value = metadata[row][col]
    
          if (key) {
            data[key] = value
          }
        }
    
        results.push(data)
      }
    
      return results
    }
  })
})
