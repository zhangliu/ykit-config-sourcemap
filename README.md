#### 简介
ykit-config-sourcemap 插件帮助你上传 sourcemap 到 sentry 服务器上！

#### 使用方式
1、切换 npm 的仓库地址到：http://npmrepo.corp.qunar.com
```
npm config set registry http://npmrepo.corp.qunar.com
```

2、安装 ykit-config-sourcemap 和 uglifyjs-webpack-plugin@1.3.0 插件
```
npm i @qnpm/ykit-config-sourcemap
npm i uglifyjs-webpack-plugin@1.3.0
```

3、打开 webpack.config.js 配置文件:
在头部引入插件
```
const uglify = require('uglifyjs-webpack-plugin')
const SentrySourcemap = require('@qnpm/ykit-config-sourcemap')
```

然后在插件配置处使用该插件：
```
plugins: [
    {
        name: '@qnpm/ykit-config-sourcemap',
        options: {
            hooks: {
                org: 'xxxxxxx', // sentry 系统中对应的你的机构名称
                project: 'xxxxx', // 项目名称
                token: 'xxxxxxx', // 授权token
                sentryService: 'http://xxxx.xxxxx.xxx', // 你的sentry服务地址
                version: 'version1', // 上传sourcemap到你项目的哪个版本中，如果没有该版本，就会自动创建
                urlPrefix: 'xxxx', // 上传到sentry服务器上后对应的地址
            }
        }
    }
]
```

在config配置处，添加uglify配置：
```
config : function () {
    this.setConfig(function (config) {
        config.plugins.push(new uglify({sourceMap: true}))
        return config;
    });
}
```

ok, 这个时候当你使用webpack打包的时候，就会自动上传sourcemap相关的文件了！