/**
 * 判断两个时间是否为同一天
 */
function isEqualDate (aDate, bDate) {
  if (aDate.getFullYear() == bDate.getFullYear()) {
    if (aDate.getMonth() == bDate.getMonth()) {
      if (aDate.getDate() == bDate.getDate()) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * assign object
 */
function objectAssign (object, props) {
  var names = Object.keys(object);
  for (var i = 0; i < names.length; i ++) {
    var name = names[i];
    object[name] = props[name];
  }
}
