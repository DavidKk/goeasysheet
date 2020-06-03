import Handlebars, { HelperOptions } from 'handlebars'

const operators = {
  '=='(lValue: string, rValue: string) {
    /* eslValueint eqeqeq:off */
    return lValue == rValue
  },
  '==='(lValue: string, rValue: string) {
    return lValue === rValue
  },
  '!='(lValue: string, rValue: string) {
    /* eslValueint eqeqeq:off */
    return lValue != rValue
  },
  '!=='(lValue: string, rValue: string) {
    return lValue !== rValue
  },
  '<'(lValue: string, rValue: string) {
    return lValue < rValue
  },
  '>'(lValue: string, rValue: string) {
    return lValue > rValue
  },
  '<='(lValue: string, rValue: string) {
    return lValue <= rValue
  },
  '>='(lValue: string, rValue: string) {
    return lValue >= rValue
  },
  typeof(lValue: string, rValue: string) {
    return typeof lValue == rValue
  },
}

function compare(lValue: string, operator: string, rValue: string, options: HelperOptions) {
  if (!operators[operator]) {
    throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`)
  }

  const result = operators[operator](lValue, rValue)
  return result ? options.fn(this) : options.inverse(this)
}

function exists(value: any, options: HelperOptions) {
  return value ? options.fn(this) : options.inverse(this)
}

Handlebars.registerHelper('compare', compare)
Handlebars.registerHelper('exists', exists)

export default Handlebars
