# Information Collection Platform for Wuhan 2019-nCoV Epidemic Prevention

[简体中文](./README.md) | English

[Progressive Web Application][1] Project

[![NPM Dependency](https://david-dm.org/wuhan2020/WebApp.svg)][2]
[![Build Status](https://travis-ci.com/wuhan2020/WebApp.svg?branch=dev)][3]

## Basics

Almost all the mainstream browsers like Chrome, Firefox, Opera, Edge, UC, Xiaomi, QQ are affordable to this web ( Nota Bene : for Safari’s slow and lagging support to [W3C][4], adding icon is available but some advanced features like caching and off-line start-up may not function )

<img width='280' src='source/image/WuHan2020-PWA.jpg' />

## Tech stack

- Logical language :  [TypeScript v3][5]
- Components engine :  [WebCell v2][6]
- Components library : [BootCell v1][7]
- State management : [MobX v5][8]
- PWA framework     : [Workbox v4][9]
- Parceling tool : [Parcel v1][10]
- CI/CD: [Travis CI][11] + [GitHub Pages][12]

## Development needs

- Task dashboard ：https://github.com/orgs/wuhan2020/projects/1?fullscreen=true

- UI design ：in progress. Please refer to existing pages for design and development.

## Native development

1. [Install Node.js](https://nodejs.org/en/download/package-manager/)

2. `git clone https://github.com/wuhan2020/WebApp.git`

3. Run the commands in the folder of this project

```shell
npm install
npm start
```

4. Install and start [rest-api](https://github.com/wuhan2020/rest-api)

[1]: https://developers.google.cn/web/progressive-web-apps
[2]: https://david-dm.org/wuhan2020/WebApp
[3]: https://travis-ci.com/wuhan2020/WebApp
[4]: https://www.w3.org/
[5]: https://typescriptlang.org
[6]: https://web-cell.dev/
[7]: https://web-cell.dev/BootCell/
[8]: https://mobx.js.org
[9]: https://developers.google.com/web/tools/workbox
[10]: https://parceljs.org
[11]: https://travis-ci.com/
[12]: https://pages.github.com/
