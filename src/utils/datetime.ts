import { div } from './math'

export function parseGMTSeconds(datetime: Date): number {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const spreadsheetTimezone = spreadsheet.getSpreadsheetTimeZone()
  const dateString = Utilities.formatDate(datetime, spreadsheetTimezone, 'EEE, d MMM yyyy HH:mm:ss')
  const date = new Date(dateString)
  const epoch = new Date('Dec 30, 1899 00:00:00')
  const diff = date.getTime() - epoch.getTime()
  return Math.round(diff / 1000)
}

export function parseGMTMinutes(datetime: Date): number {
  const seconds = parseGMTSeconds(datetime)
  return div(seconds, 60)
}

export function parseGMTHours(datetime: Date): number {
  const minutes = parseGMTMinutes(datetime)
  return div(minutes, 60)
}

export function inEffectTimeRange(hitHours: number, hitMinutes: number, hours: number, minutes: number, minutely: number): boolean {
  if (hitHours === hours && hitMinutes === minutes) {
    return true
  }

  if (hours === hitHours - 1 || (hitHours === 0 && hours === 23)) {
    if (hitMinutes - minutely < 0 && minutes + minutely > 60) {
      return true
    }
  } else if (hitHours === hours && minutes < hitMinutes) {
    if (minutes + minutely > hitMinutes) {
      return true
    }
  }

  return false
}

export function isSameDate(aDate: Date, bDate: Date) {
  if (aDate.getFullYear() == bDate.getFullYear()) {
    if (aDate.getMonth() == bDate.getMonth()) {
      if (aDate.getDate() == bDate.getDate()) {
        return true
      }
    }
  }

  return false
}
