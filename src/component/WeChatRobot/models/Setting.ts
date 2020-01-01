import KeyValueSheetModel from '../../../libs/KeyValueSheetModel'

export default class SettingModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'apikey',
        name: 'API_KEY'
      }
    ])
  }
}
