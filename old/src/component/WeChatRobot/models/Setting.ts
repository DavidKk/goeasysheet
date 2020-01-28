import KeyValueSheetModel from '../../../libs/KeyValueSheetModel'

export default class SettingModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'apikey',
        name: 'API_KEY'
      },
      {
        id: 'minutes',
        name: '触发器触发时间(分)'
      }
    ])
  }
}
