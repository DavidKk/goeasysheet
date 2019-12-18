var SettingsModel = {
  install: function () {
    KvModel.createTable(SettingsTable)
  },
  getToken: function () {
    return KvModel.get('配置', 'KEY')
  }
}
