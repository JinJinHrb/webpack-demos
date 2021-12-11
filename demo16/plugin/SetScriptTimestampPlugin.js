// const hdlUtil = require('./hdlUtil.js');
const fs = require('fs');
const Path = require('path');
const _L = require('lodash');

/**
 * 参考 https://segmentfault.com/a/1190000021821557
 */
class SetScriptTimestampPlugin {

    /**
     * 
     * @param {*} params 
     */
    constructor(params){
        params = params || {}

    }

    apply(compiler) {
        /* compiler.hooks.compilation.tap('SetScriptTimestampPlugin',
            compilation => {
                console.log('SetScriptTimestampPlugin!')
                compilation.hooks.chunkAsset.tap('chunkAsset', (module, filename) => {
                    const files = Array.from(module.files).map(a => a + '?123')
                    const newSet = new Set()
                    files.forEach(fl => {
                        newSet.add(fl)
                    })
                    module.files = newSet
                    console.log('chunkAsset:', module, filename)
                })
                compilation.hooks.assetPath.tap('assetPath', (path, options, assetInfo) => {
                    console.log('assetPath:', path, options, assetInfo)
                })
            }
        ) */
        compiler.hooks.done.tap('SetScriptTimestampPlugin', stats => {
            const context = stats?.compilation?.options?.context
            const comparedForEmitAssets = stats?.compilation?.comparedForEmitAssets || new Set()
            const jsPaths = []
            const htmlPaths = []
            let idx = 0
            comparedForEmitAssets.forEach((el) => {
                console.log(`comparedForEmitAssets ${idx++}:`, el)
                if(_L.endsWith(el, '.js')){
                    jsPaths.push(el)
                }else if(_L.endsWith(el, '.html')){
                    htmlPaths.push(Path.resolve(context, el))
                }
            })
            console.log('absPaths:', htmlPaths, jsPaths)
        })
        
    }
}
module.exports = SetScriptTimestampPlugin;
  