var ScheduleServ = {
  install: function () {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var triggers = ScriptApp.getUserTriggers(ss)
    var dailyTriggers = triggers.filter(function (triggers) {
      var isClockEvent = triggers.getEventType() === ScriptApp.EventType.CLOCK
      var isOnDailyEvent = triggers.getHandlerFunction() === 'onDaily'
      return isClockEvent && isOnDailyEvent
    })

    if (dailyTriggers.length === 0) {
      var ui = SpreadsheetApp.getUi()
      var response = ui.alert('未发现任何触发器, 是否需要自动创建每日提醒触发器?', ui.ButtonSet.YES_NO)
      if (response == ui.Button.YES) {
        ScriptApp.newTrigger('onDaily')
        .timeBased().everyDays(1).atHour(8)
        .create()
      }
    }
  }
}
