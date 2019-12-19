function SettingsController () {}

SettingsController = CreateController('settings', {
  display: function () {
    var html = HtmlService.createHtmlOutputFromFile('src/views/settings/index.html')
    SpreadsheetApp.getUi().showSidebar(html)
  },
  fetch: function () {
    var options = Leader.loadModel('settings').getValues()
    return options
  },
  submit: function (payload) {
    payload = payload || {}
    Leader.loadModel('settings').multiSet(payload)
    Leader.loadService('robot').configure({ token: payload.robotApiKey })
  }
})
