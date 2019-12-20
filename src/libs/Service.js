function Service (id, Service, props) {
  Module(id + '@service', [type], function () {
    return Leader.services[id] = new oo.class(Service, props)
  })
}
