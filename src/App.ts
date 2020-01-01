import Robot from './component/WeChatRobot'

export default class App {
  private robot: Robot

  constructor () {
    this.robot = new Robot()
  }

  public onWeChatRobot () {
    this.robot.display()
  }

  public onDaily () {
    this.robot.onDuty()
  }
}
