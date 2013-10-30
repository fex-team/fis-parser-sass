/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('node-sass');

module.exports = function(content, file, conf){
    var opts = {
        data: content
    };
    for(var i in conf){
        opts[i] = conf[i];
    }
    console.log(opts);
    return sass.renderSync(opts);
};
