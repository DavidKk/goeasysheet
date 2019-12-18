var Utils = {
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
  }
}
