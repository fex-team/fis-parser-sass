/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';


var root = fis.project.getProjectPath();
var compile = require('./compile.js');
var path = require('path');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);

    opts.include_paths = conf.include_paths || [ root ];
    opts.include_paths.unshift( file.dirname );

    opts.include_paths = opts.include_paths.map(function( dir ) {
        return path.resolve( dir );
    });

    return compile( content, file, opts );
};