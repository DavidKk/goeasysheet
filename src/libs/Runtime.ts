class Runtime {
  private models: Map<string | symbol, SheetModel>
  private services: Map<string | symbol, Service>

  constructor () {
    this.models = new Map
  }

  public model (id: string | symbol, model: SheetModel): boolean
  public model (id: string | symbol): SheetModel
  public model (id: string | symbol, model?: SheetModel) {
    if (arguments.length === 2) {
      if (this.models.get(id)) {
        return false
      }

      this.models.set(id, model)
      return true
    }

    return this.models.get(id)
  }

  public service (id: string | symbol, service: Service): boolean
  public service (id: string | symbol): Service
  public service (id: string | symbol, service?: Service) {
    if (arguments.length === 2) {
      if (this.services.get(id)) {
        return false
      }

      this.services.set(id, service)
      return true
    }

    return this.services.get(id)
  }
}

// // 每日任务触发器
// // function onDaily () {
// //   var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
// //   var sheet = spreadsheet.getSheetByName('工作表1')
// //   if (sheet == null) {
// //     return
// //   }

// //   var dateRange = sheet.getRange('M:M')
// //   var contentRange = sheet.getRange('D:D')

// //   var dates = dateRange.getValues()
// //   var contents = contentRange.getValues()

// //   var tasks = []
// //   var now = new Date()

// //   contents.forEach(function (item, row) {
// //     var date = dates[row][0]
// //     var content = item[0]

// //     if (content && date instanceof Date && isSameDate(date, now)) {
// //       tasks.push(content)
// //     }
// //   })

// //   var email = Session.getActiveUser().getEmail()
// //   MailApp.sendEmail(email, '提测提醒', '今天要提测 ' + tasks.join(',') + ' 啦!!!')
// // }
