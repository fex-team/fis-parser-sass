# fis-parser-sass

> **WARNING** : Node.js ``v0.10.0`` required!!!

A parser plugin for fis to compile sass file.

## usage

    $ npm install -g fis-parser-sass
    $ vi path/to/project/fis-conf.js

```javascript
//file : path/to/project/fis-conf.js
fis.config.merge({
    roadmap : {
        ext : {
            //compile *.scss into *.css
            scss : 'css'
        }
    },
    modules : {
        parser : {
            scss : 'sass'
        }
    }
});
```