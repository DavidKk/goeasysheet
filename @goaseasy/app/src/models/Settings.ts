import KeyValueSheetModel from '@goaseasy/core/libs/KeyValueSheetModel'

export default class SettingsModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'minutely',
        name: '每分触发器触发间隔时间(分)'
      },
      {
        id: 'daily',
        name: '每日触发器默认触发时间(时:分)'
      }
    ])
  }
}
