const exec = require('child_process').exec

const EIGHT_HOURS = 8 * 3600 * 1000
const versionGen = () => new Date(Date.now() + EIGHT_HOURS).toISOString().replace(/[^\d]/g, '')

class SentryHelper{
    constructor(config = {}) {
        const {org, project, token, sentryService} = config
        // this.versionGen = versionGen
        this.urlPrefix = config.urlPrefix || '~'
        this.cmdPre = `./node_modules/.bin/sentry-cli --url ${sentryService} --auth-token ${token} releases -o ${org} -p ${project}`
    }

    async createVersion() {
        return new Promise((resolve, reject) => {
            const cmd = `${this.cmdPre} new ${versionGen()}`
            exec(cmd, (error, stdout) => {
                if (error) reject(error)
                resolve(stdout.replace(/[^\d]*(\d+)[^\d]*/, '$1'))
            })
        })
    }

    async deleteVersion(version) {
        if (!version) return null
        return new Promise((resolve, reject) => {
            const cmd = `${this.cmdPre} delete ${version}`
            exec(cmd, (error, stdout) => {
                if (error) reject(error)
                resolve(stdout)
            })
        })
    }

    async uploadFiles(version, filePath) {
        return new Promise((resolve, reject) => {
            console.log(`开始上传 ${filePath} 下的文件...`)
            const cmd = `${this.cmdPre} files ${version} upload-sourcemaps --url-prefix '${this.urlPrefix}' ${filePath}`
            exec(cmd, (error, stdout) => {
                if (error) reject(error)
                resolve(stdout)
            })
        })
    }
}

module.exports = SentryHelper
