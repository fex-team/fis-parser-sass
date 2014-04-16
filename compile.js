/**
 * 接管sass的@import内嵌，让fis-sass支持sass语法内嵌。
 *
 * 目前fis-sass无法改动libsass(第三方库)内部的代码以至于无法支持sass格式的文件`@import`内嵌。
 *
 * 所以这里接管内嵌，绕过fis-sass处理`@import`内嵌过程。
 *
 * 目前fis-sass的是sass语法支持，主要是用了[sass2scss](https://github.com/mgreter/sass2scss)库，
 * 目前只有程序的最外成入口处调用了这个功能，libsass的内联file读取没有经过这一过程，所以这个功能是不完美支持sass语法的。
 */
var map = (function() {
    return {
        reg: /\/\*embed:(.*?)\*\//ig,

        wrap: function( value ) {
            return '/*embed:' + value + '*/';
        }
    }
})();

var sass = require('fis-sass');

// 匹配scss内嵌代码：@import 'xxx';
// @import 'xxx', 'xxx';
function _process( content ) {
    var reg = /@import\s([\s\S]*?)\n(?!\s+\S)/ig;
    // var reg = /@import[\s\S]*?;/ig;
    var rUrl = /^url/i;
    var rEnd = /;$/;

    return content.replace( reg, function( all, value ) {
        var files;

        value = value.trim().replace( rEnd, '' );

        // If the @import has any media queries.
        if ( /('|").*?\1\s+[^'"]+$/.exec(value) ) {
            return all;
        }

        files = value.split(/\s*,?\s+/m).map(function( value ) {
            var quote = '',
                match;

            value = value.trim();
            match = /^('|")(.*)\1$/.exec( value );

            if ( match ) {
                value = match[ 2 ];
                quote = match[ 1 ];
            }

            // If the file’s extension is .css.
            if ( /\.css$/i.exec( value ) ||

                // If the filename begins with http://.
                /^http/i.exec( value ) ||

                // If the filename is a url().
                /^url/i.exec( value ) ) {
                return '@import ' + quote + value + quote + ';';
            }

            return map.wrap( value );
        });

        return files.join('\n');
    });
}

// 查找文件。
function lookup( name, ext, paths ) {
    var files = [],
        filename = name,
        basename = filename,
        dirname = '',
        mapping,
        i, j, len, len2, path, info;

    files.push( filename );

    if ( /^(.*(?:\/|\\))([^\/\\]*?)$/.exec( filename ) ) {
        dirname = RegExp.$1;
        basename = RegExp.$2;
    }

    // 自动加后缀。
    if ( !/\.\w+$/.exec( basename ) ) {
        filename = dirname + basename + ext;
        files.push( filename );

        if ( !/^_/.exec( basename ) ) {
            filename = dirname + '_' + basename + ext;
            files.push( filename );
        }

        mapping = {
            '.sass': '.scss',
            '.scss': '.sass'
        };

        if ( mapping[ ext ] ) {
            filename = dirname + basename + mapping[ ext ];
            files.push( filename );

            if ( !/^_/.exec( basename ) ) {
                filename = dirname + '_' + basename + mapping[ ext ];
                files.push( filename );
            }
        }
    }

    len = files.length;
    len2 = paths.length;

    for ( i = 0; i < len; i++ ) {
        name = files[ i ];

        for ( j = 0; j < len2; j++ ) {
            info = fis.uri( name, paths[ j ] );

            if( info.file && info.file.isFile() ) {
                return info.file;
            }
        }
    }

    // console.log( paths, files );
}

function isSassSyntax( content, file ) {
    return file.ext === '.sass' && !~content.indexOf('{');
}

function unique( arr ) {
    return arr.filter(function( item, index, arr ) {
        return arr.indexOf( item ) === index;
    });
}

var compile = module.exports = function( content, file, opts ) {

    if ( isSassSyntax( content, file ) ) {
        content = sass.sass2scss( content );
    }

    opts.data = before( content, file.ext, opts.include_paths );
    content = sass.renderSync( opts );

    content = after( content, file.ext, opts.include_paths );

    return content;
}

var before = compile.before = function( content, ext, paths ) {

    paths = unique( paths );

    return _process( content ).replace( map.reg, function( all, value ) {
        var file = lookup( value, ext, paths ),
            content;

        if ( file ) {
            // @todo 祈祷，不要循环内嵌吧。

            content = file.getContent();
            if ( isSassSyntax( content, file ) ) {
                content = sass.sass2scss( content );
            }

            return before( content, file.ext, [ file.dirname ].concat( paths ) );
        } else {
            fis.log.error( value + ' not found!' );
            return '';
        }
    });
};

var after = compile.after = function( content, ext, paths ) {
    return content;
};