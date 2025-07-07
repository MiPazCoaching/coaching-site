// build-dev.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['assets/js/base/main.js'],
  bundle: true,
  outfile: 'assets/js/dist/bundle.js',
  minify: false,
  sourcemap: true,
  target: ['es6'],
  format: 'iife',
}).catch(() => process.exit(1));

