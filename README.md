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
**注意，一定要是 uglifyjs-webpack-plugin@1.3.0 版本，不然会有问题！
yikit 对其他版本的 uglifyjs-webpack-plugin 不是很兼容。**

3、打开 ykit.yo.js 配置文件:
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
                urlPrefix: 'xxxx', // 上传到sentry服务器上后对应的地址, 域名部分可以用 ~ 代替
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

4、在 portal 打包项目的时候使用自定义编译参数：ykit build -m -s -x

![](http://wiki.corp.qunar.com/confluence/download/attachments/235824521/image2019-3-5_20-22-3.png?version=1&modificationDate=1551788524000&api=v2)

为啥要使用自定义的编译参数呢？因为 ykit 也内置了代码的压缩功能，但是有问题（无法对应到sourcemap文件）
所以 ykit 在编译代码的时候，需要通过参数 -x 取消内置的压缩功能：

-m: 将代码进行最小化压缩

-s: 生成sourcemap文件

-x: 取消ykit内置的压缩机制（ykit内置压缩有问题）

**ok, 做完上面的工作的的时候，在portal上打包，就会自动上传sourcemap相关的文件了！**