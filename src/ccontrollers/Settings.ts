class SettingsController {
  private settingsModel: SettingsModel
  private robotServ: RobotService

  constructor () {
    this.settingsModel = new SettingsModel
    this.robotServ = new RobotService

    const html = HtmlService.createHtmlOutputFromFile('src/views/settings/index.html')
    SpreadsheetApp.getUi().showSidebar(html)
  }

  public fetch (): SettingsModelFields {
    return this.settingsModel.getValues() as SettingsModelFields
  }

  public submit (payload: Optional<SettingsModelFields> = {}): void {
    this.settingsModel.multiSet(payload)

    const apiToken = payload.robotApiKey
    this.robotServ.configure({ apiToken })
  }
}
