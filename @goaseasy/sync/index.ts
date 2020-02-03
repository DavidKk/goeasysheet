import { useMenu } from '@goaseasy/core/decorators/extension'
import Extension from '@goaseasy/core/libs/Extension'
import SyncModel from './models/Sync'

@useMenu('同步助手')
export default class Sync extends Extension {
  protected mSync: SyncModel

  constructor () {
    super()
  }

  @useMenu('安装')
  public created (): void {
    super.created()
    this.mSync.created()
  }

  @useMenu('卸载')
  public destroy (ui: boolean = true): void {
    if (ui) {
      if (!this.confirm('确认卸载')) {
        return
      }
    }

    super.destroy()
    this.mSync.destroy()

    ui && this.toast('卸载成功')
  }
}
