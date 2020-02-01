export function pascalCase (content: string): string {
  return `${content}`
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w+)/g, (_, $1, $2) => `${$1.toUpperCase() + $2.toLowerCase()}`)
    .replace(/\s/g, '')
    .replace(/\w/, s => s.toUpperCase());
}
