var oo = {
  class: function (Constructor, props) {
    var classArgs = Array.prototype.slice.call(arguments)
    if (classArgs.length === 1) {
      return this.class(function () {}, Constructor)
    }

    console.log(Constructor)
    if (typeof props === 'object' && props !== null) {
      Constructor.prototype = Object.create(props)
    }

    Logger.log(Constructor.prototype)
    Object.defineProperty(Constructor.prototype, 'constructor', { 
      value: Constructor, 
      enumerable: false,
      writable: true
    })

    return Constructor
  },
  inherit: function (Constructor, Parent, props) {
    var inheritArgs = Array.prototype.slice.call(arguments)
    if (inheritArgs.length === 2) {
      return this.inherit(null, Constructor, Parent)
    }

    if (inheritArgs.length === 1) {
      return this.inherit(null, Constructor)
    }

    if (inheritArgs.length === 0) {
      return this.inherit(null, function () {})
    }

    var Sub = function () {
      var args = Array.prototype.slice.call(arguments)
      typeof Constructor === 'function'
      ? Constructor.apply(this, args)
      : Parent.apply(this, args)
    }

    Sub.prototype = Object.create(Parent.prototype)
    Object.defineProperty(Sub.prototype, 'constructor', { 
      value: Sub, 
      enumerable: false,
      writable: true
    })

    if (typeof props === 'object' && props !== null) {
      var props = Object.create(props)
      Object.assign(Sub.prototype, props)
    }

    return Sub
  }
}
