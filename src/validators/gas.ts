export const clockTriggerMinutes = (minutes: number) => {
  return -1 !== [1, 5, 10, 15, 30].indexOf(minutes)
}
