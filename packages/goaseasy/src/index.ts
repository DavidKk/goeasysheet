import WorkWeixinRobot from 'goaseasy-workweixin-robot'
import { createMenus } from './utils/menus'

new WorkWeixinRobot()

createMenus(Global.Menus).addToUi()
