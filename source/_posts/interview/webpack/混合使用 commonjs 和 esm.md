---
title: 混合使用 commonjs 和 esm
date: 2021-12-14 17:20:29
categories:
    - 面试
tags:
    - webpack
---

1. es6 模块引用 commonjs, 可以直接使用. Commonjs 模块不会被编译而是会原样输出没有 default 属性.
2. es6 模块引用 es6 模块, 被调用者和调用者都会添加 `{__esModule: true}`, 实际导出的内容都是通过 `__webpack_require__.d` 添加到导出对象上的. 仅仅导入但没有使用的内容会被 tree-shaking 掉
3. commonjs 引用 es6 模块, es6 模块会被添加 `{__esModule: true}`, 如果 es6 模块中包含 export default 那么导出的模块就会被添加 default 属性. 印证了`require'balabala').default` 这个玩意儿
4. commonjs 引入 commonjs, 不会被解析. 直接原样输出

PS: 在 es6 模块化中, export 和 export default 可以混用. 然而在 commonjs 中 exports 和 module.exports 不能混用. 无论是在 node 环境还是在 webpack 中.
