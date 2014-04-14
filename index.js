/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('fis-sass');
var root = fis.project.getProjectPath();
var compile = require('./compile.js');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);

    opts.include_paths = conf.include_paths || [ root ];
    opts.include_paths.unshift( file.dirname );

    opts.data = compile.before( content, file.ext, opts.include_paths );
    content = sass.renderSync( opts );
    content = compile.after( content, file.ext, opts.include_paths );

    return content;
};