import KeyValueSheetModel from '../../../libs/KeyValueSheetModel'

export default class SettingModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'version',
        name: '版本号'
      },
      {
        id: 'apikey',
        name: 'API_KEY'
      }
    ])
  }
}
