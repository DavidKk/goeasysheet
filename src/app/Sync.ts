import without from 'lodash/without'
import uniqBy from 'lodash/uniqBy'
import { Extension } from '@/libs/Extension'
import CacheModel from '@/libs/CacheModel'
import SyncModel, { type Filter } from '@/models/Sync'
import { Menu, Action } from '@/decorators/menu'
import { Trigger } from '@/decorators/trigger'

@Menu('同步助手')
export class Sync extends Extension {
  static NAME = 'Sync'

  protected syncModel: SyncModel
  protected cacheModel: CacheModel

  constructor() {
    super()

    this.syncModel = new SyncModel()
    this.cacheModel = new CacheModel()
  }

  @Action('安装')
  public created() {
    super.created()

    this.syncModel.created()
    this.cacheModel.created()
  }

  @Action('同步数据')
  @Trigger('minutely')
  public sync() {
    this.logger.info('start sync.')

    const now = Date.now()
    const token = `minutely@${this.alias}`
    const cache = this.cacheModel.get(token)
    const { lasttime = -Infinity } = cache || {}

    const tasks = this.syncModel.fetchTasks()
    this.logger.info(`fetch sync ${tasks.length} task.`)

    if (!(Array.isArray(tasks) && tasks.length > 0)) {
      this.logger.warn('no task, skip.')
      return
    }

    const collections: Record<string, string[][]> = {}
    for (const { sheet: sheetName, fields, url, interval, filter } of tasks) {
      if (now < lasttime + interval) {
        continue
      }

      const collection = this.fetchFields(fields, url, filter)
      if (Array.isArray(collection) && collection.length > 0) {
        if (!Array.isArray(collections[sheetName])) {
          collections[sheetName] = []
        }

        collections[sheetName] = collections[sheetName].concat(collection)
      }
    }

    for (const sheetName of Object.keys(collections)) {
      const sheet = this.getSheet(sheetName)
      const keyRow = sheet.getFrozenRows() || 1
      const valueRow = keyRow + 1
      const collection = collections[sheetName]
      const range = sheet.getRange(valueRow, 1, sheet.getMaxRows(), sheet.getMaxColumns())
      range.setValue('')

      uniqBy(collection, (item) => item.join('')).forEach((values, index) => {
        if (Array.isArray(values) && values.length > 0) {
          const row = index + valueRow
          const range = sheet.getRange(row, 1, 1, values.length)
          range.setValues([values])
        }
      })
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
    this.syncModel.destroy()
    this.cacheModel.destroy()

    ui && this.toast('卸载成功')
  }

  public fetchFields(fields: string[], url: string, filterString: string): string[][] {
    const spreadsheet = SpreadsheetApp.openByUrl(url)
    const sheets = spreadsheet.getSheets()

    let filter: Filter = {}
    try {
      filter = JSON.parse(filterString)
    } catch (error) {
      // nothing todo...
    }

    const g = function* (this: Sync) {
      for (const sheet of sheets) {
        const keyRow = sheet.getFrozenRows() || 1
        const valueRow = keyRow + 1
        const sheetFields = this.getSheetFields(sheet)

        if (!(without(fields, ...sheetFields).length === 0)) {
          break
        }

        const cols = fields.map((field) => sheetFields.indexOf(field))
        const overTimeFilterCols = Array.isArray(filter.overtime) ? filter.overtime.map((field) => sheetFields.indexOf(field)) : []
        const count = sheet.getMaxRows()
        const range = sheet.getRange(valueRow, 1, count, sheetFields.length)

        for (const value of range.getValues()) {
          // 过滤空白行
          if (value.join('').trim() === '') {
            continue
          }

          // 时间过滤器
          if (!overTimeFilterCols.some((col) => value[col] > Date.now())) {
            continue
          }

          yield Array.from(
            (function* () {
              for (const col of cols) {
                const finalValue = value[col]
                yield (finalValue || '').toString()
              }
            })()
          )
        }
      }
    }

    const results = Array.from(g.apply(this))

    SpreadsheetApp.flush()
    return results
  }
}
