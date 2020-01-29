import WorkWeixinRobot from '@goaseasy/workweixin-robot'
import { createMenus } from './utils/menu'

Global.Extensions.push(WorkWeixinRobot)
Global.Extensions.map((Extension) => new Extension())

createMenus(Global.Menus).addToUi()
