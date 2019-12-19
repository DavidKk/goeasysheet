var App = {
  onOpen: function () {
    SpreadsheetApp.getUi()
    .createMenu('Robot')
    .addItem('安装', 'onAppInstall')
    .addItem('配置', 'onSettingsOpen')
    .addItem('卸载', 'onAppDestroy')
    .addToUi()
  },
  onInstall: function () {
    // ScheduleModel.install()
    // SettingsModel.install()
    // ScheduleServ.install()
  },
  openSettings: function () {
    var html = HtmlService.createHtmlOutputFromFile('src/views/settings/index.html')
    SpreadsheetApp.getUi().showSidebar(html)
  }
}

function onAppInstall () {
  App.onInstall()
}

function onSettingsOpen () {
  App.openSettings()
}

function onAppDestroy () {
}
