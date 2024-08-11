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
    this.logger.info('start check.')

    const now = Date.now()
    const token = 'excute@check'
    const cache = this.cacheModel.get(token)
    const { lasttime = -Infinity } = cache || {}

    const tasks = this.healthModel.fetchServices()
    this.logger.info(`fetch health check ${tasks.length} task.`)

    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      this.logger.warn('no task, skip.')
      return
    }

    const promises = tasks.map(({ name, url, interval }) => {
      if (now < lasttime + interval) {
        this.logger.warn(`skip "${name}" task, lasttime "${lasttime}", interval "${interval}".`)
        return Promise.resolve()
      }

      this.logger.info(`execute "${name}" task, check "${url}".`)
      return ping(url)
    })

    const results = await Promise.allSettled(promises)
    const errors = Object.fromEntries(
      function* (this: Healthc) {
        for (let i = 0; i < results.length; i++) {
          const result = results[i]
          const task = tasks[i]

          if (result.status === 'rejected') {
            const { name } = task
            const { reason } = result
            yield [name, reason]

            this.logger.fail(`health check "${name}" failed: ${reason}`)
            continue
          }
        }
      }.apply(this)
    )

    if (Object.keys(errors).length === 0) {
      this.logger.ok('all tasks success.')
    }

    this.logger.info(`cache data with token "${token}" and lasttime "${now}"`)
    this.cacheModel.set(token, { lasttime: now })

    this.logger.info('sync success.')
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
