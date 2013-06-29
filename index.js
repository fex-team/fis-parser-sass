/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('node-sass');

module.exports = function(content, file, conf){
    return sass.renderSync({
        data: content
        [ conf ]
    });
};