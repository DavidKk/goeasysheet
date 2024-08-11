export function add(noA: number, noB: number): number {
  const strA = noA.toString()
  const strB = noB.toString()

  const decimalASize = (strA.split('.')[1] || '').length
  const decimalBSize = (strB.split('.')[1] || '').length

  const intA = Number(strA.replace('.', ''))
  const intB = Number(strB.replace('.', ''))

  if (decimalASize > decimalBSize) {
    return (intA + intB * Math.pow(10, decimalASize - decimalBSize)) / Math.pow(10, Math.max(decimalASize, decimalBSize))
  }

  return (intB + intA * Math.pow(10, decimalBSize - decimalASize)) / Math.pow(10, Math.max(decimalASize, decimalBSize))
}

export function sub(noA: number, noB: number): number {
  const strA = noA.toString()
  const strB = noB.toString()

  const decimalASize = (strA.split('.')[1] || '').length
  const decimalBSize = (strB.split('.')[1] || '').length

  const intA = Number(strA.replace('.', ''))
  const intB = Number(strB.replace('.', ''))

  if (decimalASize > decimalBSize) {
    return (intA - intB * Math.pow(10, decimalASize - decimalBSize)) / Math.pow(10, Math.max(decimalASize, decimalBSize))
  }

  return (intB - intA * Math.pow(10, decimalBSize - decimalASize)) / Math.pow(10, Math.max(decimalASize, decimalBSize))
}

export function mul(noA: number, noB: number): number {
  let decimalSize = 0

  const strA = noA.toString()
  const strB = noB.toString()

  decimalSize += (strA.split('.')[1] || '').length
  decimalSize += (strB.split('.')[1] || '').length

  const intA = Number(strA.replace('.', ''))
  const intB = Number(strB.replace('.', ''))

  return (intA * intB) / Math.pow(10, decimalSize)
}

export function div(noA: number, noB: number): number {
  const strA = noA.toString()
  const strB = noB.toString()

  const decimalASize = (strA.split('.')[1] || '').length
  const decimalBSize = (strB.split('.')[1] || '').length

  const intA = Number(strA.replace('.', ''))
  const intB = Number(strB.replace('.', ''))

  return (intA / intB) * Math.pow(10, decimalBSize - decimalASize)
}
