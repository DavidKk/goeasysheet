// 初始化
function onOpen () {
  App.install();
}

// 打开微信机器人设置
function onRobotSetting () {
  Gui.openSettings();
}

// 提交配置回调
function onSubmitSettings (payload) {
  payload = payload || {};

  var token = payload.token || '';
  Model.set(SettingsTable, 'KEY', token);
  Robot.configure({ token: token });
}
