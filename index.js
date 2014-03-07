/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('fis-sass');
var root = fis.project.getProjectPath();

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);
    opts.data = content;
    opts.include_paths = conf.include_paths || [];
    opts.include_paths = opts.include_paths.concat([ file.dirname, root ]);
    return sass.renderSync(opts);
};