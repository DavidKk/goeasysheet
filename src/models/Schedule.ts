import { ListModel } from '@/libs/ListModel'
import { sub, mul } from '@/utils/math'
import { parseGMTHours, parseGMTSeconds } from '@/utils/datetime'

const MODEL_NAME = '企业微信机器人'

const DTO_SHEET = {
  id: 'sheet',
  name: '任务名称',
  comment: '字符串; 对应数据表名称',
}

const DTO_CONTENT = {
  id: 'content',
  name: '发送内容',
  comment: '字符串; 对应数据表中发送内容的引用; 例如: !A1:A',
}

const DTO_DATETIME = {
  id: 'datetime',
  name: '执行时间',
  comment: '字符串; 对应数据表中发送时间的引用; 例如: !B1:B',
}

const DTO_API_KEY = {
  id: 'apikey',
  name: 'API_KEY',
  comment: '字符串; 企业微信机器人提供的 API KEY',
}

const DTO_TYPE = {
  id: 'type',
  name: '触发类型',
  comment: '枚举类型; 决定时间触发时机; daily: 每日触发, minutely: 每几分钟触发',
}

const DTO_EXTRA = {
  id: 'extra',
  name: '其他字段',
  comment: 'JSON字符串; 对应数据表中横向字段引用: 例如: {"id":"!A2:A"}',
}

const DTO_MESSAGE_TYPE = {
  id: 'messageType',
  name: '模板类型',
  comment: '枚举类型; 具体参考机器人相关信息; text: 文本(默认), markdown: Markdown 标记语言',
}

const DTO_TEMPLATE = {
  id: 'template',
  name: '消息模板',
  comment: '字符串; 发送消息模板, 可通过变量替换数据, 使用的模板引擎为 Handlebars; 例如: {{#each this}}{{content}}{{/each}}',
}

export default class ScheduleModel extends ListModel {
  static NAME = 'ScheduleModel'

  constructor() {
    super(MODEL_NAME, [DTO_SHEET, DTO_CONTENT, DTO_DATETIME, DTO_API_KEY, DTO_TYPE, DTO_EXTRA, DTO_MESSAGE_TYPE, DTO_TEMPLATE])
  }
}
