import KeyvalueSheetModel from '../libs/KeyvalueSheetModel'

export default class SettingsModel extends KeyvalueSheetModel {
  constructor () {
    super('Settings', [
      {
        id: 'version',
        name: '版本号'
      },
      {
        id: 'robotApiKey',
        name: '企业微信机器人API_KEY'
      }
    ])
  }
}

interface SettingsModelFields {
  version: string
  robotApiKey: string
}
