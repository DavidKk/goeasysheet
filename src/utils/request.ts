export type Params<Q extends Record<string, any>> = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions & { payload?: Q }

export function isJsonType(type: string): type is 'application/json' {
  return type === 'application/json'
}

export async function request<Q extends Record<string, any>>(url: string, params?: Params<Q>) {
  const { payload: inPayload, contentType = 'application/json' } = params || {}
  const isJsonData = isJsonType(contentType)
  const payload = isJsonData ? JSON.stringify(inPayload) : inPayload

  const finalParams: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    contentType,
    ...params,
    payload,
  }

  const response = UrlFetchApp.fetch(url, finalParams)
  // 检查响应状态码
  const statusCode = response.getResponseCode()
  if (!(statusCode >= 200 && statusCode < 300)) {
    const content = response.getContentText()
    throw new Error(`Request failed with status code ${statusCode}: ${content}`)
  }

  return response
}

export async function requestJSON<Q extends Record<string, any>, R = Record<string, any>>(url: string, params?: Params<Q>): Promise<R> {
  const response = await request(url, params)
  const result = response.getContentText()
  return JSON.parse(result)
}

export async function ping(url: string) {
  return request(url, { contentType: 'text/html;charset=utf-8' })
}
