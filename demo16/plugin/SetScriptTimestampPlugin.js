const hdlUtil = require('./hdlUtil.js')
const fs = require('fs')
const Path = require('path')
const _L = require('lodash')
const Phin = require('phin')
const logger = {
    info: console.log,
    error: console.error
}

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
        this.author = _L.trim(params.author)
        this.indexTargetPath = _L.trim(params.indexTargetPath) // index.html 目标位置
        this.uploadUrl = _L.trim(params.uploadUrl) // 上传 OSS 路径
        this.baseUrl = _L.trim(params.baseUrl) // 上传 OSS 前缀
        this.password = _L.trim(params.password) // 上传 OSS 密码
        this.ossKey = _L.trim(params.ossKey) // 上传 OSS 前缀
        if(this.baseUrl &&!_L.endsWith(this.baseUrl, '/')){
            this.baseUrl = this.baseUrl + '/'
        }
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
        compiler.hooks.done.tap('SetScriptTimestampPlugin', async (stats) => {
            try{
                const context = stats?.compilation?.options?.context
                const dirPath = Path.resolve(context, 'dist')

                /* 
                const jsPaths = []
                const htmlPaths = []
                const comparedForEmitAssets = stats?.compilation?.comparedForEmitAssets || new Set()
                let idx = 0
                comparedForEmitAssets.forEach((el) => {
                    console.log(`comparedForEmitAssets ${idx++}:`, el)
                    if(_L.endsWith(el, '.js')){
                        jsPaths.push(el)
                    }else if(_L.endsWith(el, '.html')){
                        htmlPaths.push(Path.resolve(dirPath, el))
                    }
                })
                console.log('absPaths:', htmlPaths, jsPaths) */
                
                const feed = await new Promise((rsv, rej) => {
                    fs.readdir(dirPath, function(err, rsp){
                        if(err){
                            return rej(err);
                        }
                        if(!rsp){
                            rsp = [];
                        }
                        rsp = rsp.filter(a => a.indexOf('.') !== 0).map(a => Path.resolve(dirPath, a))
                        rsv(rsp);
                    })
                })

                const jsPaths = feed.filter(a => _L.endsWith(a, '.js'))
                const htmlPaths = feed.filter(a => _L.endsWith(a, '.html'))
                console.log('readdir #77:', jsPaths, htmlPaths)
                
                // 1. alter index.html
                // 2. move directory
                const alterHtmlPromises = htmlPaths.map(el => new Promise((rsv, rej) => {
                    let rst
                    getFileDataPromise(el).then(content => {
                        const extracts = Array.prototype.slice.call(content.match(/src="[^"]+"/))
                        const substitutes = extracts.map(a => a.replace('src="', '').replace(/"$/, '')).map(a => `src="${this.baseUrl}${a}"`)
                        extracts.forEach((a, idx) => {
                            const substitute = substitutes[idx]
                            content = content.replace(a, substitute)
                        })
                        rst = fs.writeFileSync(el, content, {encoding: 'utf8'})
                        if(_L.endsWith(el, 'index.html') && this.indexTargetPath){
                            return moveFilePromise(el, this.indexTargetPath)
                        }
                    }).then(() => {
                        rsv(rst)
                    }, err => {
                        rej(err)
                    })
                }))

                await Promise.all(alterHtmlPromises)
                
                // 3. upload OSS
                if(this.uploadUrl){
                    const reqdata = {
                        author: this.author,
                        createdAt: hdlUtil.date2string(new Date(), 'ss')
                    };
                    const attachments = jsPaths.map((a, idx) => {
                        const lastSlashIdx = a.lastIndexOf(Path.sep);
                        const fdFilename = a.slice(lastSlashIdx + 1);
                        return [fdFilename, a]
                    }).filter((a, idx, arr) => {
                        for(let i=0; i<Math.min(arr.length, idx); i++){
                            if(a[0] === arr[i][0]){
                                return false
                            }
                        }
                        return true
                    });
                    attachments.push(['Product.json', '/Users/alexwang/Downloads/Product.json'])
                    const requestParams = { url: this.uploadUrl, reqdata, attachments /* , parse: 'no' */ }
                    requestPostPromise(requestParams).then(feed => {
                        console.log('requestPostPromise #229 feed:', feed, '|', requestParams)
                    }, err => {
                        console.log('requestPostPromise #231 error:', err, '|', requestParams)
                    })
                }
                
            }catch(e){
                console.error(e)
            }
        })
        
    }
}
module.exports = SetScriptTimestampPlugin;



/**
 * 移动文件
 * @param {*} fromPath 
 * @param {*} toPath 
 * @returns 
 */
 const moveFilePromise = (fromPath, toPath) => {
    return new Promise((rsv, rej) => {
        if(!fs.existsSync(fromPath)){
            return rsv({msg: `filePath not exist: ${fromPath}`})
        }
        fs.rename(fromPath, toPath, err => {
            if(err){
                rej(err)
            }else{
                rsv({fromPath, toPath})
            }
        })
    })
}

/**
 * 获取文件内容 
 * @param encoding 默认 utf8；获取二进制数据，请用 buffer
 */
 const getFileDataPromise = (filePath, encoding) => {
    return new Promise(function(rsv, rej){
        const cb = function(err, data){
            if(err){
                return rej(err);
            }
            rsv(data);
        }
        const readFileArgs = [filePath];
        if(encoding === 'buffer'){
            readFileArgs.push(cb);
        }else{
            if(!encoding){
                encoding = 'utf8';
            }
            readFileArgs.push({encoding});
            readFileArgs.push(cb);
        }
        fs.readFile.apply(this, readFileArgs);
    });
}

/**
 * await只能放在async函数里 
 * @param {String} url
 * @param {Object} reqdata
 * @param {String} reqtype 请求类型 multipart, multipart/form-data
 * @param {Array} attachments 二维数组：[[字段名，文件名(可选)，文件路径 | {filePath, contentType}], ...]
 * @param {Object} core 参考 https://nodejs.org/api/http.html#http_http_request_url_options_callback
 * @param {String} parse 结果不做处理，请置为 'no'
 */
const requestPostPromise  = (args = {}) => {
    const { url = '', reqdata = {}, reqtype='', attachments = [], parse = 'json', core = {}, logsign = '' } = args;
    let formData; // 当检测到是 multipart/form-data 请求时赋值
    let boundary = args.boundary;
    return new Promise((rsv_root, rej_root) => {
        (() => {
            if(!hdlUtil.hasKeyWords(reqtype, ['multipart']) && hdlUtil.isEmptyObject(attachments)){
                return Promise.resolve(null);
            }
            if(!boundary){
                boundary = '^^#@@#$$';
            }
            return new Promise((rsv0, rej0) => {
                const metaarr = [];
                for(var i in reqdata){
                    // https://dev.to/aman_singh/what-s-the-deal-with-object-prototype-hasownproperty-call-4mbj
                    if ({}.hasOwnProperty.call(reqdata, i)) {
                        const elem = reqdata[i];
                        if(elem && elem instanceof Array){
                            elem.forEach(el => {
                                metaarr.push(`--${boundary}\r\n`);
                                metaarr.push(`Content-Disposition: form-data; name="${i}"; \r\n\r\n${el}\r\n`);
                            })
                        }else{
                            metaarr.push(`--${boundary}\r\n`);
                            metaarr.push(`Content-Disposition: form-data; name="${i}"; \r\n\r\n${elem}\r\n`);
                        }
                    }
                }
                const metadata = hdlUtil.isNotEmptyObject(metaarr) ? metaarr.join('') : null;
                const attachFilePaths = attachments.map(a => {
                    if(!(a instanceof Array) || a.length < 2 || a.length > 3){
                        return;
                    }
                    const lastEl = a.slice(-1)[0];
                    if(hdlUtil.oType(lastEl) === 'string'){
                        return lastEl;
                    }else if(hdlUtil.oType(lastEl) === 'object'){
                        return hdlUtil.getDeepVal(lastEl, 'filePath');
                    }
                });
                const q_all = attachFilePaths.map(a => {
                    if(!a){
                        return;
                    }
                    return getFileDataPromise(a, 'buffer');
                });
                Promise.all(q_all).then(feeds1 => {
                    const payloadarr = [];
                    if(metadata){
                        payloadarr.push(Buffer.from(metadata));
                    }
                    feeds1.forEach((buff, idx) => {
                        if(!buff){
                            return;
                        }
                        const elem = attachments[idx]; // elem 如果不是正常数组，buff 必然为空

                        let filePath, contentType;
                        const lastEl = elem.slice(-1)[0];
                        if(hdlUtil.oType(lastEl) === 'string'){
                            filePath = lastEl;
                        }else if(hdlUtil.oType(lastEl) === 'object'){
                            filePath = hdlUtil.getDeepVal(lastEl, 'filePath');
                            contentType = hdlUtil.getDeepVal(lastEl, 'contentType');
                        }
                        if(!contentType){
                            contentType = 'application/octet-stream';
                        }

                        const fdName = elem[0];
                        let fdFilename;
                        if(elem.length === 3){
                            fdFilename = elem[1];
                        }else if(elem.length === 2){
                            const lastSlashIdx = filePath.lastIndexOf(Path.sep);
                            fdFilename = filePath.slice(lastSlashIdx + 1);
                        }
                        payloadarr.push(Buffer.from(`--${boundary}\r\n`));
                        payloadarr.push(Buffer.from(`Content-Disposition: form-data; name="${fdName}"; filename="${fdFilename}"\r\n`));
                        payloadarr.push(Buffer.from(`Content-Type:${contentType}\r\n\r\n`));
                        payloadarr.push(buff);
                        payloadarr.push(Buffer.from('\r\n'));
                    })
                    payloadarr.push(Buffer.from(`--${boundary}--\r\n"`));
                    const payload = Buffer.concat(payloadarr);
                    rsv0(payload);
                }, err1 => {
                    rej0(err1);
                })
            })
        })().then(async (feed) => {
            formData = feed;
            if(logsign){
                logger.info(`requestPostPromise #3291 (${logsign}) reqdata:`, reqdata, url);
            }
            const obj = {
                url: url,
                method: 'POST',
                data: reqdata
            };
            if(formData){
                if(!core.headers){
                    core.headers = {};
                }
                core.headers = _L.merge(core.headers, {"Content-Type": "multipart/form-data; boundary=" + boundary});
                obj.data = formData;
            }else{
                obj.data = reqdata;
            }
            if(parse !== 'no'){
                obj.parse = parse;
            }
            /* if(url.indexOf('https:') === 0 && url.indexOf('591ubull.com') > -1){
                core.agent = httpsAgent591ubull;
            } */
            if(hdlUtil.isNotEmptyObject(core)){
                obj.core = core;
            }
            const response = await Phin(obj).catch(err => {
                const errMsg = hdlUtil.printError(err);
                if(errMsg && errMsg.indexOf('Unexpected token') < 0){
                    logger.error('requestPostPromise #3306', err, '|', url);
                }
                throw {code: 110, msg: `invalid url: ${url}, reqdata: ${JSON.stringify(reqdata)}`};
            })
            if(parse === 'no'){ // 如果 parse === 'no', 不再执行其他解析
                return response;
            }
            let parsed = null;
            const res = hdlUtil.getDeepVal(response, 'body') || {};
            if(hdlUtil.oType(res) === 'string'){

                if(res.indexOf('!DOCTYPE') > -1){
                    logger.error(`requestPostPromise #3303 (${logsign}) !DOCTYPE body:`, res, logsign);
                    throw {errMsg: res};
                }else{
                    try{
                        parsed = hdlUtil.parseJsonWithNumber2String(res);
                    }catch(e){
                        logger.error(`requestPostPromise #3310 (${logsign}) JSON.parse ERROR`, e, '|', res, logsign);
                        parsed = res
                    }
                }
            }else{
                parsed = res;
            }
            return parsed;
        }).then(function(feed){
            rsv_root(feed)
        }).catch(function(err){
            if(!err){
                return;
            }
            rej_root(err);
        })
    })

}
  