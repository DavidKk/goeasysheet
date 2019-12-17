var Gui = {
  installMenu: function () {
    SpreadsheetApp.getUi()
      .createMenu('微信机器人')
      .addItem('提醒', 'onAlarmSetting')
      .addSeparator()
      .addItem('设置', 'onRobotSetting')
      .addToUi();
  },
  openSettings: function () {
    var html = HtmlService.createHtmlOutputFromFile('settings.html');
    SpreadsheetApp.getUi().showSidebar(html);
  },
  openAlarmSettings: function () {
    
  }
};
