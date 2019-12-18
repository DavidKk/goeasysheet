function onSettingsSubmit (payload) {
  payload = payload || {}

  var token = payload.token || ''
  KvModel.set(SettingsTable.name, 'KEY', token)
  Robot.configure({ token: token })
}

function reqSettingsDatas () {
  var options = KvModel.getAll(SettingsTable.name)
  return options
}
