var App = {
  onOpen: function () {
    var ui = SpreadsheetApp.getUi()

    ui.createMenu('Robot')
    .addItem('安装', 'onAppInstall')
    .addItem('配置', 'onSettingsOpen')
    .addToUi()
  },
  onInstall: function () {
    ScheduleServ.install()
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
