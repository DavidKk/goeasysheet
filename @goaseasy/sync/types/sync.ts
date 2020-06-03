export type SyncTask = {
  sheet: string
  fields: string[]
  url: string
  interval: number
  filter: string
}

export type Filter = {
  overtime?: string[]
}
