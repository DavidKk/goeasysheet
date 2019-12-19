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
    for (var i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return array[i]
      }
    }d 
  },
  findIndex: function (array, callback) {
    for (var i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return i
      }
    }

    return -1
  }
}
