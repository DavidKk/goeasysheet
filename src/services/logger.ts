export interface LogOptions {
  prefix?: string
}

function prefixStr(message: string, ...prefixes: string[]) {
  const prefixStr = Array.from(
    (function* () {
      for (const prefix of prefixes) {
        if (!prefix) {
          continue
        }

        yield `[${prefix.toLocaleUpperCase()}]`
      }
    })()
  )

  return prefixStr ? `${prefixStr.join('')} ${message}` : message
}

export function ok(message: string, options?: LogOptions) {
  const { prefix = '' } = options || {}
  const content = prefixStr(message, 'OK', prefix)
  // eslint-disable-next-line no-console
  console.log(content)
}

export function info(message: string, options?: LogOptions) {
  const { prefix = '' } = options || {}
  const content = prefixStr(message, 'INFO', prefix)
  // eslint-disable-next-line no-console
  console.info(content)
}

export function fail(message: string, options?: LogOptions) {
  const { prefix = '' } = options || {}
  const content = prefixStr(message, 'FAIL', prefix)
  // eslint-disable-next-line no-console
  console.error(content)
}

export function warn(message: string, options?: LogOptions) {
  const { prefix = '' } = options || {}
  const content = prefixStr(message, 'WARN', prefix)
  // eslint-disable-next-line no-console
  console.warn(content)
}

export function debug(message: string, options?: LogOptions) {
  const { prefix = '' } = options || {}
  const content = prefixStr(message, 'DEBUG', prefix)
  // eslint-disable-next-line no-console
  console.debug(content)
}

export function getLogger(name: string) {
  const _ok = (message: string) => ok(message, { prefix: name })
  const _info = (message: string) => info(message, { prefix: name })
  const _fail = (message: string) => fail(message, { prefix: name })
  const _warn = (message: string) => warn(message, { prefix: name })
  const _debug = (message: string) => debug(message, { prefix: name })
  return { ok: _ok, info: _info, fail: _fail, warn: _warn, debug: _debug }
}
