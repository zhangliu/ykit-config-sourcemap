const SentryHelper = require('./sentryHelper')
const fs = require('fs')

let options

module.exports = {
    config: (opts, cwd) => options = opts,
    hooks: {
        afterPack: async (cliParams, stats) => {
            const {hooks} = options || {}
            console.log(`获取到 sroucemap 配置：`, hooks)
            if (!hooks) return

            let version
            const sentry = new SentryHelper(options.hooks)
            try {
                const assets = stats.compilation.assets
                // Object.keys(assets).forEach(key => {
                //     fs.appendFileSync(assets[key].existsAt, `\n//# sourceMappingURL=${key}.map`)
                // })
    
                console.log('开始生成 sentry 版本号...')
                version = hooks.version || (await sentry.createVersion())
                console.log(`使用 sentry 版本号：${version}`)

                console.log('清空该版本下的所有旧文件...')
                await sentry.deleteFiles(version)
    
                console.log('开始上传压缩文件到 sentry 系统...')
                await sentry.uploadFiles(version, `${process.cwd()}/prd`)
                console.log('开始上传 sourcemap 文件到 sentry 系统...')
                await sentry.uploadFiles(version, `${process.cwd()}/prd_sourcemap`)
                console.log(`上传至版本 ${version} 成功！`)
            } catch (e) {
                console.error('上传文件至 sentry 失败！', e)
                await sentry.deleteVersion(version)
                throw e
            }
        }
    }
}