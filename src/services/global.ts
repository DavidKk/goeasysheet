var RootGlobal: Global = this as any

/** 获取全局变量 */
export function getGlobal() {
  if (typeof Global !== 'undefined') {
    return Global
  }

  RootGlobal.Menus = []
  RootGlobal.Triggers = []
  RootGlobal.Extensions = []

  return RootGlobal
}
