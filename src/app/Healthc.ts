import { Extension } from '@/libs/Extension'
import CacheModel from '@/libs/CacheModel'
import { Menu, Action } from '@/decorators/menu'
import { Trigger } from '@/decorators/trigger'
import HealthModel from '@/models/Health'
import { ping } from '@/utils/request'

@Menu('健康检查')
export class Healthc extends Extension {
  static NAME = 'Healthc'

  protected healthModel: HealthModel
  protected cacheModel: CacheModel

  constructor() {
    super()

    this.healthModel = new HealthModel()
    this.cacheModel = new CacheModel()
  }

  @Action('安装')
  public created() {
    super.created()

    this.healthModel.created()
    this.cacheModel.created()
  }

  @Action('立即检测')
  @Trigger('minutely')
  public async check() {
    this.logger.info('Starting health check.')

    const now = Date.now()
    const token = 'execute@check'
    const cache = this.cacheModel.get(token)
    const { lasttime = -Infinity } = cache || {}

    const tasks = this.healthModel.fetchServices()
    this.logger.info(`Fetched ${tasks.length} health check tasks.`)

    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      this.logger.warn('No tasks found, skipping.')
      return
    }

    const promises = tasks.map(({ name, url, interval }) => {
      if (now < lasttime + interval) {
        this.logger.warn(`Skipping "${name}" health check task, last check time "${lasttime}", interval "${interval}".`)
        return Promise.resolve()
      }

      this.logger.info(`Executing "${name}" health check task, checking "${url}".`)
      return ping(url)
    })

    const results = await Promise.allSettled(promises)
    results.forEach((result, index) => {
      const task = tasks[index]

      if (result.status === 'rejected') {
        const { reason } = result
        this.logger.fail(`Health check "${task.name}" failed: ${reason}.`)
      } else {
        this.logger.ok(`Health check "${task.name}" succeeded.`)
      }
    })

    this.logger.info(`Caching data with token "${token}" and last check time "${now}".`)
    this.cacheModel.set(token, { lasttime: now })

    this.logger.info('Health check completed.')
  }

  @Action('卸载')
  public destroy(ui = true): void {
    if (ui) {
      if (!this.confirm('确认卸载')) {
        return
      }
    }

    super.destroy()
    this.healthModel.destroy()
    this.cacheModel.destroy()

    ui && this.toast('卸载成功')
  }
}
