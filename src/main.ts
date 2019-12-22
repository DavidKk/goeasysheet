function onInstall () {
  onOpen()
}

function onOpen () {
  SpreadsheetApp.getUi()
  .createMenu('助手')
  .addItem('安装', 'MenuInstall')
  .addItem('配置', 'MenuOpenSettings')
  .addItem('卸载', 'MenuDestroy')
  .addToUi()
}

function onMenuInstall () {
  const model = {
    schedule: new ScheduleModel,
    settings: new SettingsModel
  }

  const service = {
    robot: new RobotServ,
    schedule: new ScheduleServ
  }

  new App({ model, service })
}

function onMenuOpenSettings () {

}

function onMenuDestroy () {

}
