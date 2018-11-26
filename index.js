const SentryHelper = require('./sentryHelper')
const fs = require('fs')
const co = require('co')

let options

module.exports = {
    config: (opts, cwd) => options = opts,
    hooks: {
        afterPack: co.wrap(function *(cliParams, stats) {
            const {hooks} = options || {}
            console.log(`获取到 sroucemap 配置：`, hooks)
            if (!hooks) return

            let version
            const sentry = new SentryHelper(options.hooks)
            try {
                // const assets = stats.compilation.assets
                // Object.keys(assets).forEach(key => {
                //     fs.appendFileSync(assets[key].existsAt, `\n//# sourceMappingURL=${key}.map`)
                // })
    
                console.log('开始生成 sentry 版本号...')
                version = yield sentry.createVersion(hooks.version)
                console.log(`使用 sentry 版本号：${version}`)

                console.log('清空该版本下的所有旧文件...')
                yield sentry.deleteFiles(version)
    
                console.log('开始上传压缩文件到 sentry 系统...')
                yield sentry.uploadFiles(version, `${process.cwd()}/prd`)
                console.log('开始上传 sourcemap 文件到 sentry 系统...')
                yield sentry.uploadFiles(version, `${process.cwd()}/prd_sourcemap`)
                console.log(`上传至版本 ${version} 成功！`)
            } catch (e) {
                console.error('上传文件至 sentry 失败！', e)
                yield sentry.deleteVersion(version)
                throw e
            }
        })
    }
}