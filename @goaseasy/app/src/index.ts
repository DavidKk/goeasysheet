import Runtime from '@goaseasy/runtime'
import WorkWeixinRobot from '@goaseasy/workweixin-robot'

Global.Extensions.push(WorkWeixinRobot)

export default new Runtime({
  extensions: Global.Extensions,
  menus: Global.Menus,
  triggers: Global.Triggers
})
