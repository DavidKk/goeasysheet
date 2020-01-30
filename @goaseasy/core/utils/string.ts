export function pascalCase (content: string): string {
  return `${content}`
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w+)/g, (_, $1, $2) => `${$1.toUpperCase() + $2.toLowerCase()}`)
    .replace(/\s/g, '')
    .replace(/\w/, s => s.toUpperCase());
}

export function hashCode (content: string): string {
  let hash = 0
  if (content.length === 0) {
    return hash.toString(32)
  }

  for (let i = 0; i < content.length; i ++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }

  return hash.toString(32)
}

export function repeat (content: string, repeatNo: number): string {
  let result: string = ''
  for (let i = repeatNo; i --;) {
    result += content
  }

  return result
}
