class SettingsComponent {
  @Model(SettingsModel)
  private mSettings: SettingsModel

  @Service(RobotService)
  private sRobot: RobotService

  @Bridge
  public fetch (): SettingsModelFields {
    return this.mSettings.getValues() as SettingsModelFields
  }

  @Bridge
  public submit (payload: Optional<SettingsModelFields> = {}): void {
    this.mSettings.multiSet(payload)

    const apiToken = payload.robotApiKey
    this.sRobot.configure({ apiToken })
  }

  public display (): void {
    const html = HtmlService.createHtmlOutputFromFile('src/component/settings/index.html')
    SpreadsheetApp.getUi().showSidebar(html)
  }
}
