var SettingsModel = {
  install: function () {
    KvModel.createTable(SettingsTable)
  },
  getToken: function () {
    return KvModel.get('配置', 'KEY')
  }
}

new KvModel('配置', [
  {
    id: 'key',
    name: '令牌'
  }
])