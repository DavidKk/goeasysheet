class ScheduleServ extends Service {
  constructor () {
    super()

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const triggers = ScriptApp.getUserTriggers(ss)
    const dailyTriggers = triggers.filter(function (triggers) {
      const isClockEvent = triggers.getEventType() === ScriptApp.EventType.CLOCK
      const isOnDailyEvent = triggers.getHandlerFunction() === 'onDaily'
      return isClockEvent && isOnDailyEvent
    })
  
    if (dailyTriggers.length === 0) {
      const ui = SpreadsheetApp.getUi()
      const response = ui.alert('未发现任何触发器, 是否需要自动创建每日提醒触发器?', ui.ButtonSet.YES_NO)

      if (response == ui.Button.YES) {
        ScriptApp.newTrigger('onDaily')
        .timeBased().everyDays(1).atHour(8)
        .create()
      }
    }
  }
}
