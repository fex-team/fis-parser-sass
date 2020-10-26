# fis-parser-sass

新版本已改成 dart-sass 了，纯 js 版本，相比 fis-parser-node-sass (libsass) 版本要慢一点。但是这个版本跟 Ruby 版本功能上是比较接近的。

https://github.com/sass/dart-sass/blob/master/differences.md

## 安装与使用

全局安装

```bash
npm install fis-parser-sass -g
```

开启插件

```javascript
fis.config.merge("modules.parser", {
  sass: "sass",
  scss: "sass",
});

fis.config.merge("roadmap.ext", {
  sass: "css",
  scss: "css",
});
```

插件配置

```javascript
fis.config.set("settings.parser.sass", {
  // 加入文件查找目录
  include_paths: [],
});
```
