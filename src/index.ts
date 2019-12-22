import App from './App'
let app: App

function onInstall () {
  onOpen()
}

function onOpen () {
  app = new App()

  // SpreadsheetApp.getUi()
  // .createMenu('助手')
  // .addItem('设置', 'onMenuOpenSettings')
  // .addToUi()
}

// function onMenuOpenSettings () {
//   app.openSettings()
// }
