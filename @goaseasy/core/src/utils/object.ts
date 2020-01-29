export function assign (object: { [key: string]: any }, props: { [key: string]: any }): void {
  const names = Object.keys(object)
  for (let i = 0; i < names.length; i ++) {
    const name = names[i]
    object[name] = props[name]
  }
}
