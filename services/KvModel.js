var KvModel = {
  /**
   * 创建表
   * @param {Object} table
   * @param {string} table.type 表类型
   * @param {string} table.name 表名称
   * @param {Array<{ name: string }>} [table.columns] 字段名
   * @param {Array<{ name: string }>} [table.rows] 字段名
   */
  createTable: function (table) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(table.name);
    if (sheet != null) {
      return;
    }

    var sheets = spreadsheet.getSheets();
    sheet = spreadsheet.insertSheet(table.name, sheets.length);

    /**
     * 写入字段
     */
    var fileds = table.rows.map(function (item) {
      return item.name;
    });

    var range = sheet.getRange(1, 1, fileds.length, 1);
    range.setHorizontalAlignment('center');
    range.setFontSize(12);
    range.setFontWeight('bold');
    range.setFontColor('#ffffff');
    range.setBackground('#22538f');
    range.setValues([fileds]);
    sheet.setFrozenRows(1);

    /**
     * 设置仅自身具有编辑权限
     */
    var protection = sheet.protect().setDescription('数据受保护');
    var me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    protection.canDomainEdit() && protection.setDomainEdit(false);

    SpreadsheetApp.flush();
  },
  getRangeByKey: function (table, key) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(table);
    if (sheet === null) {
      return null;
    }

    var row = sheet.getMaxRows();
    var range = sheet.getRange(1, 1, row);
    var values = range.getValues();
    var col = values[0].findIndex(function (item) {
      return item.name === key
    });

    if (-1 === col) {
      return null;
    }

    return sheet.getRange(1, col);
  },
  get: function (table, key) {
    var range = KvModel.getRangeByKey(table, key);
    return range.getValues();
  },
  set: function (table, key, value) {
    var range = KvModel.getRangeByKey(table, key);
    return range.setValue(value);
  }
};
