var App = {
  /**
   * 初始化
   */
  install: function () {
    Gui.installMenu();

    // WeChatRobot.configure({
    //   token: '924fa3b7-4b9f-4f92-8cb4-0391b45d3949-123'
    // });

    // Pm.install();
    // Schedule.create();
  },
  showSettings: function () {
    
  },
  /**
   * 重置
   */
  reInstall: function () {
    Schedule.destroy();
    Schedule.create();
  },
  /**
   * 销毁
   */
  destroy: function () {
    Schedule.destroy();
  }
};
