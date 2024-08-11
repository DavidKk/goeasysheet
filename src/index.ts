import { Runtime } from './core/Runtime'
import { getGlobal } from './services/global'
import { Sync } from './app/Sync'
import { Healthc } from './app/Healthc'

const global = getGlobal()

global.Extensions.push(Sync)
global.Extensions.push(Healthc)

export default new Runtime({
  extensions: global.Extensions,
  menus: global.Menus,
  triggers: global.Triggers,
})
