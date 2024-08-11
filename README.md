# Goeasysheet

**Goeasysheet** 是一个基于 Google Sheets 和 Google Apps Script 的自动化项目，旨在简化定时任务的管理。通过使用 Google Sheets 作为数据存储和任务管理平台，该项目能够轻松实现服务健康检查、提醒通知等任务的自动化执行。

## 背景

Google Apps Script 提供了对 Google Sheets 的读写能力，并支持基于时间的触发器功能，能够在指定时间自动运行脚本。这使 Google Sheets 不仅成为灵活的数据存储工具，还成为自动化日常任务的理想平台。

借助 Goeasysheet，用户可以在 Google Sheets 中配置并自动运行各类任务。例如，安排服务健康检查确保系统正常运行，或设置提醒功能以避免错过重要截止日期。

## 前提条件

在开始使用 Goeasysheet 之前，请确保已完成以下设置步骤：

### 1. 安装依赖工具

首先，安装 [clasp](https://github.com/google/clasp/blob/master/docs/run.md) 工具，这是一个用于管理 Google Apps Script 项目的命令行工具。

```bash
$ npm install -g clasp
$ clasp login
```

### 2. 创建 Google Cloud 项目

1. **访问 Google Cloud Console**：

- 登录 [Google Cloud Console](https://console.cloud.google.com/)。
- 创建一个新的项目，命名为 `Goeasysheet` 或其他合适的名称。

2. **启用 Google Apps Script API**：

- 在项目中，导航到 “API 和服务” > “启用 API 和服务”。
- 搜索并启用 `Google Apps Script API`。

### 3. 设置 OAuth 2.0 凭证

1. **创建 OAuth 2.0 客户端 ID**：

- 在 Google Cloud Console 中，导航到 “API 和服务” > “凭证”。
- 点击 “创建凭证”，选择 “OAuth 2.0 客户端 ID”。
- 配置 OAuth 同意屏幕，输入应用名称、支持邮箱等信息。
- 设置应用类型为 `桌面应用` 或 `Web 应用`，然后创建客户端 ID。
- 下载 `client_secret.json` 文件，并将其保存到本地项目中。

2. **设置 OAuth 同意屏幕**：

- 在同一页面的 `OAuth 同意屏幕` 选项中，填写必要的应用信息（例如应用名称、支持邮箱等）。
- 添加 `Google Sheets API` 和 `Google Drive API` 到授权范围中。

### 4. 授权并部署

在本地项目中，使用以下命令进行授权和部署：

```bash
# 登录并授权应用
$ pnpm run login

# 构建并部署到 Google Apps Script
$ pnpm build
```

## 使用指南

构建将直接发布到 Google Apps Script，请确保网络连接正常。

```bash
# 安装依赖
$ pnpm install
# 授权应用
$ pnpm run login
# 构建
$ pnpm build
# 或进入开发模式
$ pnpm dev
```

## Google Sheets 中的 Tab 设置

### 1. 设置

| **A**          | **B** |
| :------------- | ----: |
| **每分触发器** |     1 |
| **每日触发器** |  9:30 |

### 2. 同步助手

|    **A**     |                   **B**                    |    **C**     |    **D**     |
| :----------: | :----------------------------------------: | :----------: | :----------: |
| **任务名称** |              **需同步数据表**              | **间隔时间** | **过滤条件** |
|   任务同步   | https://docs.google.com/spreadsheets/d/xxx |      5       |              |

### 3. 健康检查

|    **A**     |      **B**      |    **C**     |
| :----------: | :-------------: | :----------: |
| **服务名称** |  **服务地址**   | **间隔时间** |
|    health    | https://foo/bar |      5       |

## 许可证

本项目基于 MIT 许可证开源。
