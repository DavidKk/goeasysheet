import { hashCode, repeat, pursue } from './string'
import { get } from './object'

type Render = (data: any) => string

const Caches = {}

export const EachRegExp = /<each\s+([\w\W]*?)>([\w\W]*)<\/each>/
export const EchoRegExp = /<echo\s*>([\w\W]*?)<\/echo>/
export const BreakRegExp = /<break(?:\s+(\d+?)?\s*)?\/>/
export const SplitRegExp = /<split\s+([\w\W]*?)(?:\s+?([\w\W]+?))?\s*?\/>/

export function EachLogic (matched: RegExpExecArray): Render {
  const [matchedContent, path, innerTemplate] = matched
  return (data: any): string => {
    const collection = path === 'this' ? data : get(data, path, []) || []
    if (!Array.isArray(collection)) {
      throw new Error(`${matchedContent} ${path} is not a array`)
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return collection.map(compile(innerTemplate)).join('')
  }
}

export function EchoLogic (matched: RegExpExecArray): Render {
  const [, content] = matched
  return (data: any): string => {
    const source = content.replace(/\{([\w\W]+?)\}/g, (_, path) => {
      const content = path === 'this' ? data : get(data, path, '')
      return typeof content === 'string' ? content.trim() : content
    })

    return pursue(source)
  }
}

export function BreakLogic (matched: RegExpExecArray): Render {
  const [, line] = matched
  return (): string => {
    return repeat('\n', parseInt(line, 10) || 1)
  }
}

export function SplitLogic (matched: RegExpExecArray): Render {
  const [matchedContent, path, content] = matched
  return (data: any): string => {
    const collection = path === 'this' ? data : get(data, path, []) || []
    if (!Array.isArray(collection)) {
      throw new Error(`${matchedContent} ${path} is not a array`)
    }

    return collection.join(pursue(content))
  }
}

export function compile (template: string): Render {  
  const hash = hashCode(template)
  if (typeof Caches[hash] === 'function') {
    return Caches[hash]
  }

  const renders: { [key: string]: Render} = {}
  const regexps: RegExp[] = [
    // 优先级最高, 块级并内嵌
    EachRegExp,
    // 块级, 无内嵌
    EchoRegExp,
    // 行内
    BreakRegExp, SplitRegExp
  ]

  const logics: Array<(matched: RegExpExecArray) => Render> = [
    // 优先级最高, 块级并内嵌
    EachLogic,
    // 块级, 无内嵌
    EchoLogic,
    // 行内
    BreakLogic, SplitLogic
  ]

  let code = template
  let content = template
  regexps.forEach((regexp, index) => {
    const logic = logics[index]

    let matched: RegExpExecArray | null
    while (matched = regexp.exec(code)) {
      const [matchedContent] = matched
      const render = logic(matched)
      const index = content.indexOf(matchedContent)

      if (-1 === index) {
        throw new Error('Can not found matched content')
      }

      renders[index] = render
      code = code.replace(matchedContent, '')
      content = content.replace(matchedContent, repeat(String.fromCharCode(0), matchedContent.length))
    }
  })

  function render (data: any): string {
    const messages = Object.keys(renders).sort().map((index) => {
      const render = renders[index]
      return render(data)
    })

    return messages.join('')
  }

  Caches[hash] = render
  return render
}

export function render (data: any, template: string): string {
  return compile(template)(data)
}
