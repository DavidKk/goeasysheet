class ScheduleModel extends ListSheetModel {
  constructor () {
    super('Schedule', [
      {
        id: 'task',
        name: '任务名称'
      },
      {
        id: 'content',
        name: '发送内容'
      },
      {
        id: 'datetime',
        name: '执行时间'
      },
      {
        id: 'status',
        name: '任务状态'
      }
    ])
  }
}
