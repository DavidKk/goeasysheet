function Controller (id, Ctrl, props) {
  Module(id + '@controller', function () {
    Logger.log('Register Controller ' + id)

    var ctrl = new oo.class(Ctrl, props)

    return Leader.controllers[id] = function (method) {
      var args = Array.prototype.slice.call(arguments, 1)
      var func = ctrl[method]
      return func.apply(ctrl, args)
    }
  })
}
