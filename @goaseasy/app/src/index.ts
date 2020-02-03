import Runtime from '@goaseasy/runtime'
import WorkWeixinRobot from '@goaseasy/workweixin-robot'
import Sync from '@goaseasy/sync'

Global.Extensions.push(WorkWeixinRobot)
Global.Extensions.push(Sync)

export default new Runtime({
  extensions: Global.Extensions,
  menus: Global.Menus,
  triggers: Global.Triggers
})
