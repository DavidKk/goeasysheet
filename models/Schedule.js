var Schedule = {
  install: function () {
    Model.createTable(ScheduleTable);
  },
  getTasks: function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(ScheduleTable.name);
    if (sheet === null) {
      return [];
    }

    var row = sheet.getMaxRows();
    var col = ScheduleTable.columns.length;
    var range = sheet.getRange(2, 1, row, col);
    var tasks = range.getValues().filter(function (datas) {
      return datas[1] instanceof Date;
    });

    return tasks;
  }
};
