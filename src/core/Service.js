var CreateService = function (id, Service, props) {
  return Leader.services[id] = new oo.class(Service, props)
}
