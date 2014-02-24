/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('fis-sass');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);
    opts.data = content;
    opts.include_paths = conf.include_paths || [ file.subdirname ];
    return sass.renderSync(opts);
};