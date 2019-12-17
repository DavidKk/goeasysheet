var Gui = {
  install: function () {
    SpreadsheetApp.getUi()
    .createMenu('微信机器人')
    // .addItem('提醒', 'onAlarmSetting')
    // .addSeparator()
    .addItem('设置', 'onSettingsOpen')
    .addToUi();
  },
  openSettings: function () {
    var html = HtmlService.createHtmlOutputFromFile('views/settings/index.html');
    SpreadsheetApp.getUi().showSidebar(html);
  }
};
