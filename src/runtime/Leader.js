var Leader = {
  models: {},
  controllers: {},
  services: {},
  getCollectionByType: function (type) {
    switch (type.toLowerCase()) {
      case 'model':
        return this.models
      case 'controller':
        return this.controllers
      case 'service':
        return this.services
    }
  },
  load: function (type, id) {
    var collection = this.getCollectionByType(type)
    var Module = collection[id]
    if (typeof Module === 'function') {
      return collection[id] = new Module
    }

    return Module
  },
  loadModel: function (id) {
    return this.load('model', id)
  },
  loadController: function (id) {
    return this.load('controller', id)
  },
  loadService: function (id) {
    return this.load('service', id)
  }
}
