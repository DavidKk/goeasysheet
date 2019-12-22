var app

function onInstall () {
  onOpen()
}

function onOpen () {
  app = Bootstrap['default']()
  
  .createMenu('助手')
  .addItem('配置', 'onMenuOpenSettings')
  .addToUi()
}

function onMenuOpenSettings () {
  app.openSettings()
}
