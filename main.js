// 初始化
function onOpen () {
  App.install();
}

// 每日任务触发器
function onDaily () {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var names = sheets.map(function (sheet) {
    return sheet.getName();
  });

  var email = Session.getActiveUser().getEmail();
  MailApp.sendEmail(email, '定时任务发送备案', '内容' + JSON.stringify(names));
}

function test () {
  var data = KvModel.getAll(SettingsTable.name);
  Logger.log(data);
}
