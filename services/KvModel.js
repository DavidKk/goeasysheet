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
    sheet.setFrozenColumns(1);

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
      SpreadsheetApp.flush();
      return null;
    }

    var row = sheet.getMaxRows();
    var range = sheet.getRange(1, 1, row);
    var values = range.getValues();
    var col = values[0].findIndex(function (item) {
      return item.name === key
    });

    if (-1 === col) {
      SpreadsheetApp.flush();
      return null;
    }

    SpreadsheetApp.flush();
    return sheet.getRange(1, col);
  },
  set: function (table, key, value) {
    var range = KvModel.getRangeByKey(table, key);
    return range.setValues([value]);
  },
  get: function (table, key) {
    var data = KvModel.getAll(table);
    return data[key];
  },
  getAll: function (table) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(table);
    if (sheet === null) {
      SpreadsheetApp.flush();
      return null;
    }

    var row = sheet.getMaxRows();
    var range = sheet.getRange(1, 1, row, 2);
    var values = range.getValues();
    var result = {};
    var names = values[0];
    var values = values[1];

    for (var i = 0; i < names.length; i ++) {
      var name = names[i];
      var value = values[i];
      result[name] = value;
    }

    SpreadsheetApp.flush();
    return result;
  },
  setAll: function (table, datas) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(table);
    if (sheet === null) {
      SpreadsheetApp.flush();
      return false;
    }

    var row = sheet.getMaxRows();
    var range = sheet.getRange(1, 1, row);
    var heads = range.getValues();

    var params = [];
    for (var row = 0; row < heads.length; row ++) {
      var head = heads[row][0];
      if (head) {
        var value = datas[head] || '';
        params.push([value]);
      }
    }

    range = sheet.getRange(1, 2, 1, params.length);
    range.setValues(params);

    SpreadsheetApp.flush();
  }
};
