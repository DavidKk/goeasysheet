function includeHtml (filename: string) {
  const content = HtmlService.createHtmlOutputFromFile(filename).getContent()
  return content
}

function includeCSS (filename: string) {
  const content = HtmlService.createHtmlOutputFromFile(filename).getContent()
  return '<style>' + content + '</style>'
}

function includeScript (filename: string) {
  const content = HtmlService.createHtmlOutputFromFile(filename).getContent()
  return '<script>' + content + '</script>'
}
