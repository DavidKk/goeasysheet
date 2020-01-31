export function assign <T, U, I>(target: T, source: U, ...others: I[]): T & U & Required<I> {
  const names = Object.keys(source)
  for (let i = 0; i < names.length; i ++) {
    const name = names[i]
    target[name] = source[name]
  }

  if (others.length > 0) {
    return assign.call(null, target, ...others)
  }

  return target as any
}

export function get (target: Record<string, any>, path: string, defaultValue?: any): any {
  const travel = (regexp: RegExp) => String.prototype.split
  .call(path, regexp)
  .filter(Boolean)
  .reduce((res: any, key: string) => (res !== null && res !== undefined ? res[key] : res), target)

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === target ? defaultValue : result
}
