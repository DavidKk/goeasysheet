// 初始化
function onOpen () {
  App.install();
}

function test () {
  KvModel.setAll(SettingsTable.name, { 'KEY': '123' });
}
