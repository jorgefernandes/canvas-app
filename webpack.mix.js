// webpack.mix.js

let mix = require('laravel-mix');

mix.js('./app.js', 'dist').setPublicPath('dist');
