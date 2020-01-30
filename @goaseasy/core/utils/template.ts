import { hashCode, repeat } from './string'

type Render = (data: any) => string

const Caches = {}

export const EachRegExp = /<each\s+([a-zA-Z$][a-zA-Z0-9_$]*?)>(.*)<\/each>/
export const EchoRegExp = /<echo\s*>([\w\W]*?)<\/echo>/
export const BreakRegExp = /<break(?:\s+(\d+?)?\s*)?\/>/
export const SplitRegExp = /<split\s+([a-zA-Z$][a-zA-Z0-9_$]*?)(?:\s+(.+))?\s*\/>/

export function EachLogic (matched: RegExpExecArray): Render {
  const [, variable, innerTemplate] = matched
  return (data: any): string => {
    const collection = variable === 'this' ? data : data[variable]
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return collection.map(compile(innerTemplate))
  }
}

export function EchoLogic (matched: RegExpExecArray): Render {
  const [, content] = matched
  return (data: any): string => {
    return content.replace(/\{([a-zA-Z$][a-zA-Z0-9_$]*?)\}/g, (_, variable) => {
      return variable === 'this' ? data : data[variable]
    })
  }
}

export function BreakLogic (matched: RegExpExecArray): Render {
  const [, line] = matched
  return (): string => {
    return repeat('\n', parseInt(line, 10) || 1)
  }
}

export function SplitLogic (matched: RegExpExecArray): Render {
  const [, variable, content] = matched
  return (data: any): string => {
    const collection = variable === 'this' ? data : data[variable]
    return collection.join(content)
  }
}

export function compile (template: string): Render {  
  const hash = hashCode(template)
  if (typeof Caches[hash] === 'function') {
    return Caches[hash]
  }

  const renders: Render[] = []
  const regexps: RegExp[] = [EachRegExp, EchoRegExp, BreakRegExp, SplitRegExp]
  const logics: Array<(matched: RegExpExecArray) => Render> = [EachLogic, EchoLogic, BreakLogic, SplitLogic]

  let code = template
  let content = template
  regexps.forEach((regexp, index) => {
    const logic = logics[index]

    let matched: RegExpExecArray | null
    while (matched = regexp.exec(code)) {
      const [matchedContent] = matched
      const index = content.search(matchedContent)
      const render = logic(matched)
      renders[index] = render

      code = code.replace(matchedContent, '')
      content = content.replace(matchedContent, repeat(' ', matchedContent.length))
    }
  })

  function render (data: any): string {
    return renders.filter(Boolean).map((render) => render(data)).join('')
  }

  Caches[hash] = render
  return render
}

export function render (data: any, template: string): string {
  return compile(template)(data)
}
