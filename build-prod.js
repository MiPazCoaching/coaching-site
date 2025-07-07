// build-prod.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['assets/js/base/main.js'],
  bundle: true,
  outfile: 'assets/js/dist/bundle-min.js',
  minify: true,
  sourcemap: false, // o 'inline' para debug remoto
  target: ['es6'],
  format: 'iife',
}).catch(() => process.exit(1));

