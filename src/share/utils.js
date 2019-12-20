var utils = {
  isSameDate: function (aDate, bDate) {
    if (aDate.getFullYear() == bDate.getFullYear()) {
      if (aDate.getMonth() == bDate.getMonth()) {
        if (aDate.getDate() == bDate.getDate()) {
          return true
        }
      }
    }
    
    return false
  },
  assign: function (object, props) {
    var names = Object.keys(object)
    for (var i = 0; i < names.length; i ++) {
      var name = names[i]
      object[name] = props[name]
    }
  },
  find: function (array, callback) {
    if (typeof callback === 'function') {
      for (var i = 0; i < array.length; i ++) {
        if (callback(array[i], i) === true) {
          return array[i]
        }
      }

      return
    }

    if (typeof callback === 'object') {
      var props = Object.keys(callback)
      for (var i = 0; i < array.length; i ++) {
        var item = array[i]
        var mathced = 0

        for (var j = 0; j < props.length; j ++) {
          var prop = props[j]
          item[prop] === callback[prop] && mathced ++
        }

        if (mathced === props.length) {
          return item
        }
      }
    }
  },
  findIndex: function findIndex (array, callback) {
    if (typeof callback === 'function') {
      for (var i = 0; i < array.length; i ++) {
        if (callback(array[i], i) === true) {
          return i
        }
      }
    }

    if (typeof callback === 'object') {
      var props = Object.keys(callback)
      for (var i = 0; i < array.length; i ++) {
        var item = array[i]
        var mathced = 0

        for (var j = 0; j < props.length; j ++) {
          var prop = props[j]
          item[prop] === callback[prop] && mathced ++
        }

        if (mathced === props.length) {
          return i
        }
      }
    }

    return -1
  }
}
