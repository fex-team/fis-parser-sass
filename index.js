/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('node-sass');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);
    opts.data = content;
    return sass.renderSync(opts);
};