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

// 匹配sass内嵌代码：@import 'xxx'
function _process( content ) {
    var reg = /@import\s*('|")?(.+?)\1(?:;)?$/img;
    var rUrl = /^url/i;

    return content.replace( reg, function( all, quote, value ) {

        // 不处理@import url(xxx);
        if ( value && rUrl.exec( value ) ) {
            return all;
        }

        return map.wrap( value );
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
}

var compile = exports.before = function( content, ext, paths ) {
    return _process( content ).replace( map.reg, function( all, value ) {
        var file = lookup( value, ext, paths );

        if ( file ) {
            // @todo 祈祷，不要循环内嵌吧。
            return compile( file.getContent(), file.ext, [ file.dirname ].concat( paths ) );
        } else {
            fis.log.error( value + ' not found!' );
            return '';
        }
    });
};

exports.after = function( content, ext, paths ) {
    return content;
};