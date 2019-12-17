var Schedule = {
  /**
   * 创建时间表
   */
  create: function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    var sheet = spreadsheet.getSheetByName(SCHEDULE_NAME);
  
    if (sheet == null) {
      /**
       * 创建数据存储表格
       */
      sheet = spreadsheet.insertSheet(SCHEDULE_NAME, sheets.length);
      sheet.setFrozenRows(1);
  
      var range = sheet.getRange(1, 1, 1, 3)
      range.setValues([SCHEDULE_TABLE_HEAD]);
      range.setHorizontalAlignment('center');
      range.setFontSize(12);
      range.setFontWeight('bold');
      range.setFontColor('#ffffff');
      range.setBackground('#22538f');
  
      var row = sheet.getMaxRows();
      var col = sheet.getMaxColumns();
      var protection = sheet.getRange(row, col).protect().setDescription('提醒数据受保护');
  
      /**
       * 设置自身编辑权限
       */
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
    
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);
      }
    }

    SpreadsheetApp.flush();
  },
  /**
   * 获取需要执行的任务列表
   */
  getTasks: function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SCHEDULE_NAME);
    if (sheet === null) {
      return [];
    }

    var row = sheet.getMaxRows();
    var range = sheet.getRange(2, 1, row, SCHEDULE_TABLE_HEAD.length);
    var dateCol = SCHEDULE_TABLE_HEAD.indexOf(SCHEDULE_DATE_TEXT);
    var tasks = range.getValues().filter(function (datas) {
      return datas[dateCol] instanceof Date;
    });
    
    SpreadsheetApp.flush();
    return tasks;
  },
  /**
   * 删除时间表
   */
  destroy: function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SCHEDULE_NAME);
    if (sheet == null) {
      SpreadsheetApp.flush();
      return;
    }

    spreadsheet.deleteSheet(sheet);
    SpreadsheetApp.flush();
  }
};
