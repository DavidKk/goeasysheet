// 打开微信机器人设置
function onSettingsOpen () {
  Gui.openSettings();
}

function onSettingsSubmit (payload) {
  payload = payload || {};

  var token = payload.token || '';
  KvModel.set(SettingsTable, 'KEY', token);
  Robot.configure({ token: token });
}

function reqSettingsDatas () {
  var options = KvModel.getAll(SettingsTable);
  return options;
}
