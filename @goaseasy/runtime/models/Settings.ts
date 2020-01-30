import KeyValueSheetModel from '@goaseasy/core/libs/KeyValueSheetModel'
import { minutelyInterval, dailyTime } from '../constants/settings'

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

  public create (): void {
    super.create()

    this.multiSet({ minutely: minutelyInterval, daily: dailyTime })
  }
}
