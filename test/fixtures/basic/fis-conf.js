var parser = require('../../../');

fis.config.set('modules.parser', {
    sass : parser,
    scss: parser
});

fis.config.set('roadmap.ext', {
    sass: 'css',
    scss: 'css'
});

fis.config.set('settings.parser', [{


}]);

fis.config.set('roadmap.path', [
    {
        reg: '**/_*.*',
        release: false,
        useAMD: false,
        useOptimizer: false
    }
]);

fis.config.set('modules.prepackager', 'derived');
