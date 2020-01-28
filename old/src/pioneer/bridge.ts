function bridge (namespace: string, ...args: any[]) {
  if (typeof GlobalBridges[namespace] === 'undefined') {
    return null
  }

  return GlobalBridges[namespace](...args)
}
