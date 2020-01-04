interface GoogleRun {
  withSuccessHandler: (response: any) => this
  withFailureHandler: (response: any) => this
  withUserObject: (object: Object) => this
  bridge: (namespace: string, ...args: any[]) => this
}

declare const google: {
  script: {
    run: GoogleRun
  }
}
