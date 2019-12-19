function onInstall (event) {
  onOpen(event)
}

function onOpen () {
  App.onOpen()
}

function onDaily () {
}

// 每日任务触发器
// function onDaily () {
//   var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
//   var sheet = spreadsheet.getSheetByName('工作表1')
//   if (sheet == null) {
//     return
//   }

//   var dateRange = sheet.getRange('M:M')
//   var contentRange = sheet.getRange('D:D')

//   var dates = dateRange.getValues()
//   var contents = contentRange.getValues()

//   var tasks = []
//   var now = new Date()

//   contents.forEach(function (item, row) {
//     var date = dates[row][0]
//     var content = item[0]

//     if (content && date instanceof Date && isSameDate(date, now)) {
//       tasks.push(content)
//     }
//   })

//   var email = Session.getActiveUser().getEmail()
//   MailApp.sendEmail(email, '提测提醒', '今天要提测 ' + tasks.join(',') + ' 啦!!!')
// }
