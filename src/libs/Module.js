var GlobalModules = []

function Module (name, deps, module) {
  if (arguments.length === 2) {
    return Module(name, [], module)
  }

  var index = utils.findIndex(GlobalModules, { name: name })
  if (-1 === index) {
    Logger.log(name + ' has been registed')
    return
  }

  GlobalModules.push({ name: name, deps: deps, module: module })
}

function Require (name) {
  var module = utils.find(GlobalModules, { name: name })
  if (!module) {
    Logger.log(name + ' is not registed')
    return null
  }

  if (module.deps.length > 0) {
    deps = deps.map(function (dep) {
      return Require(dep)
    })
  }

  if (typeof module.module === 'function') {
    return module.module.apply(null, deps)
  }

  return module.module
}
