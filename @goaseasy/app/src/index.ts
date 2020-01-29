import WorkWeixinRobot from '@goaseasy/workweixin-robot'
import { createMenus } from './utils/menu'
import { createTriggers } from './utils/trigger'

Global.Extensions = [
  WorkWeixinRobot,
]

Global.Extensions.map((Extension) => new Extension())

createMenus(Global.Menus).addToUi()
createTriggers(Global.Triggers)
Logger.log(Global.Triggers)