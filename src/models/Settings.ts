import { KVModel } from '@/libs/KVModel'

/** 名称 */
const MODEL_NAME = '设置'

/** 定义通用的 cron 表达式配置 */
const DTO_MINUTELY = {
  id: 'minutely',
  name: '每分触发器触发间隔时间',
  comment: '数字; 单位(分); 分钟触发器每N分钟触发一次时间, 有效值为: 1,5,10,15,30',
}

const DTO_DAILY_TIME = {
  id: 'dailyTime',
  name: '每日触发器触发时间',
  comment: '字符串; 每天触发触发器触发的时间, 格式为: HH:mm; 例如: 09:30',
}

export class SettingsModel extends KVModel {
  static NAME = 'SettingsModel'

  constructor() {
    super(MODEL_NAME, [DTO_MINUTELY, DTO_DAILY_TIME])
  }
}
