/**
 * 接管sass的@import内嵌，通过fis来内嵌，能得到更好的效果。
 * 这样不仅可以内嵌sass格式的，还可内嵌其他语法格式的css文件。
 */
var map = (function() {
    return {
        reg: /\/\*embed:(.*?)\*\//ig,

        wrap: function( value ) {
            return '/*embed:' + value + '*/';
        }
    }
})();

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

function lookup( name, ext, paths ) {
    var files = [],
        filename = name,
        i, j, len, len2, path, info;

    // 自动加后缀。
    if ( !/\.\w+$/.exec( filename ) ) {
        filename = name + ext;
    }

    files.push( filename );

    if ( !/^\_/.exec( filename ) ) {
        files.push( '_' + filename );
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

exports.before = function( content, ext, paths ) {
    return _process( content ).replace( map.reg, function( all, value ) {
        var file = lookup( value, ext, paths );

        if ( file ) {
            return file.getContent();
        } else {
            fis.log.error( value + ' not found!' );
            return '';
        }
    });
};

exports.after = function( content, ext, paths ) {
    return content;
};