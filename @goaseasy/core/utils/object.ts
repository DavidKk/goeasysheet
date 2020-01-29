export function assign <T, U, I>(target: T, source: U, ...others: I[]): T & U & Required<I> {
  const names = Object.keys(target)
  for (let i = 0; i < names.length; i ++) {
    const name = names[i]
    target[name] = source[name]
  }

  if (others.length > 0) {
    return assign.call(null, target, ...others)
  }

  return target as any
}
