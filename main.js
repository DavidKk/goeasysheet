// 初始化
function onOpen () {
  App.install();
}

// 打开微信机器人设置
function onRobotSetting () {
  Gui.openSettings();
}

// 打开提醒设置
function onAlarmSetting () {
  Gui.openAlarmSettings();
}

// 提交配置回调
function onSubmitSettings () {

}

// 每日执行钩子
function onDaily () {
}

// 重新安装钩子
function onReInstall () {
  App.reInstall();
}

// 销毁钩子
function onDestroy () {
  App.destroy();
}

