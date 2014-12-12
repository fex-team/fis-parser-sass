/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';


var root = fis.project.getProjectPath();
// var sass = require('fis-sass');
var path = require('path');

var compile = require('./compile.js');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);

    opts.include_paths = conf.include_paths || [ root ];
    opts.include_paths.unshift( file.dirname );

    opts.include_paths = opts.include_paths.map(function( dir ) {
        if (dir[0] !== '/') {
            dir = path.join(root, dir);
        }
        return path.resolve( dir );
    });

    // opts.data = content;

    // if (file.ext === '.sass') {
    //     opts.sassSyntax = true;
    // }

    // return sass.renderSync(opts);

    return compile( content, file, opts );
};