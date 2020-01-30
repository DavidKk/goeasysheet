import KeyValueSheetModel from '@goaseasy/core/libs/KeyValueSheetModel'
import { minutelyInterval } from '../constants/settings'

export default class SettingsModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'minutely',
        name: '每分触发器触发间隔时间(分)'
      }
    ])
  }

  public created (): void {
    super.created()

    this.multiSet({ minutely: minutelyInterval })
  }
}
