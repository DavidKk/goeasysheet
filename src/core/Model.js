var CreateModel = function (BaseModel, id, alias, fields) {
  var Contructor = function () {
    BaseModel.call(this, alias, fields)
  }

  return Leader.models[id] = oo.inherit(Contructor, BaseModel)
}
