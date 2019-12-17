/**
 * 安装钩子
 */
function onInstall () {
  App.install();
}

/**
 * 每日执行钩子
 */
function onDaily () {
  App.alarm();
}

/**
 * 重新安装钩子
 */
function onReInstall () {
  App.reInstall();
}

/**
 * 销毁钩子
 */
function onDestroy () {
  App.destroy();
}
