import App from '../App'

declare var Bootstrap: {
  default: () => App
}

function getApp (): App {
  return Bootstrap['default']()
}

function onInstall () {
  onOpen()
}

function onOpen () {
  SpreadsheetApp.getUi()
  .createMenu('GoAsEasy')
  .addItem('微信机器人', 'onWeChatRobot')
  .addItem('执行计划任务', 'onDaily')
  .addToUi()
}

function onWeChatRobot () {
  getApp().onWeChatRobot()
}

function onDaily () {
  getApp().onDaily()
}
