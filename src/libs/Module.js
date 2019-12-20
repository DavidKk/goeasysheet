function Module (name, deps, module) {
  if (arguments.length === 2) {
    return Module(name, [], module)
  }

  if (!Array.isArray(Module.registers)) {
    Module.registers = []
  }

  if (!Array.isArray(Module.modules)) {
    Module.modules = []
  }

  Module.registers.push(function () {
    var index = utils.findIndex(Module.modules, { name: name })
    if (-1 !== index) {
      Logger.log(name + ' has been registed')
      return
    }
  
    Module.modules.push({ name: name, deps: deps, module: module })
  })
}

Module.require = function (name) {
  var module = utils.find(Module.modules, { name: name })
  if (!module) {
    Logger.log(name + ' is not registed')
    return null
  }

  var deps = module.deps.map(function (dep) {
    return Module.require(dep)
  })

  if (typeof module.module === 'function') {
    return module.module.apply(null, deps)
  }

  return module.module
}

Module.run = function () {
  Module.registers.forEach(function (register) {
    register()
  })

  Logger.log(Module.registers.length)
  Logger.log(Module.modules.length)

  Module.modules.forEach(function (module) {
    Module.require(module.name)
  })
}
