# 武汉新型冠状病毒防疫信息收集平台

[渐进式 Web 应用][1]项目

[![NPM Dependency](https://david-dm.org/wuhan2020/wuhan2020.github.io.svg)][2]
[![Build Status](https://travis-ci.com/wuhan2020/wuhan2020.github.io.svg?branch=dev)][3]

## 基本用法

谷歌 Chrome、谋智 Firefox、欧朋、微软 Edge、UC 浏览器、小米浏览器、QQ 浏览器等均可**安装本网站到桌面**（Safari 对 [W3C 国际标准][4]支持迟缓，只能添加图标，**网络缓存**、**离线启动**等高级功能可能无法使用）

![](source/image/WuHan2020-PWA.jpg)

## 技术栈

-   逻辑语言: [TypeScript v3][5]
-   组件引擎: [WebCell v2][6]
-   组件库: [BootCell v1][7]
-   状态管理: [MobX v5][8]
-   PWA 框架: [Workbox v4][9]
-   打包工具: [Parcel v1][10]
-   CI / CD: [Travis CI][11] + [GitHub Pages][12]

## 开发需求

-   任务看板：https://github.com/orgs/wuhan2020/projects/1?fullscreen=true

-   UI 设计：正在赶制，参与开发的先参照现有页面

## 本地开发

1. [安装 Node.js](https://nodejs.org/en/download/package-manager/)

2. `git clone https://github.com/wuhan2020/wuhan2020.github.io.git`

3. 在本项目文件夹中执行命令

```shell
npm install
npm start
```

4. 安装、启动[后端项目](https://github.com/wuhan2020/rest-api)

[1]: https://developers.google.cn/web/progressive-web-apps
[2]: https://david-dm.org/wuhan2020/wuhan2020.github.io
[3]: https://travis-ci.com/wuhan2020/wuhan2020.github.io
[4]: https://www.w3.org/
[5]: https://typescriptlang.org
[6]: https://web-cell.dev/
[7]: https://web-cell.dev/BootCell/
[8]: https://mobx.js.org
[9]: https://developers.google.com/web/tools/workbox
[10]: https://parceljs.org
[11]: https://travis-ci.com/
[12]: https://pages.github.com/
