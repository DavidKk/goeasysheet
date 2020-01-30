import KeyValueSheetModel from '@goaseasy/core/libs/KeyValueSheetModel'
import { minutelyInterval, dailyTime } from '../constants/settings'

export default class SettingsModel extends KeyValueSheetModel {
  constructor () {
    super('设置', [
      {
        id: 'minutely',
        name: '每分触发器触发间隔时间',
        comment: '数字; 单位(分); 分钟触发器每N分钟触发一次时间, 有效值为: 1,5,10,15,30'
      },
      {
        id: 'dailyTime',
        name: '每日触发器触发时间',
        comment: '字符串; 每天触发触发器触发的时间, 格式为: HH:mm; 例如: 09:30'
      }
    ])
  }

  public created (): void {
    super.created()
    this.multiSet({ minutely: minutelyInterval, dailyTime })
  }
}
