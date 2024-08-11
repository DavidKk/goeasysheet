import { ListModel } from '@/libs/ListModel'

/** 名称 */
const MODEL_NAME = '健康检查'

const DTO_SERVICE_NAME = {
  id: 'name',
  name: '服务名称',
  comment: '字符串; 对应数据表名称',
}

const DTO_URL = {
  id: 'url',
  name: '需同步数据表',
  comment: '字符串; https://',
}

const DTO_INTERVAL = {
  id: 'interval',
  name: '间隔时间',
  comment: '数字; 同步间隔时间, 单位(分)',
}

export type SyncTask = {
  sheet: string
  fields: string[]
  url: string
  interval: number
  filter: string
}

export type Filter = {
  overtime?: string[]
}

export default class HealthModel extends ListModel {
  static NAME = 'HealthModel'

  constructor() {
    super(MODEL_NAME, [DTO_SERVICE_NAME, DTO_URL, DTO_INTERVAL])
  }

  public fetchServices() {
    this.logger.info('fetch services.')

    const rows = this.select()
    if (rows.length === 0) {
      this.logger.warn('no services.')
      return []
    }

    const g = function* (this: HealthModel) {
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i] || {}
        const { name, url, interval } = item

        if (this.isEnd(item)) {
          break
        }

        if (!name) {
          this.logger.warn(`invalid name: ${name}`)
          continue
        }

        if (!/https?:\/\//.test(url)) {
          this.logger.warn(`invalid url: ${url}`)
          continue
        }

        yield { name, url, interval }
      }
    }

    const list = Array.from(g.apply(this))
    this.logger.info(`fetch ${list.length} services.`)

    return list
  }
}
