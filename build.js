// build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['assets/js/base/main.js'],
  bundle: true,
  outfile: 'assets/js/dist/bundle.js',
  minify: true,
  sourcemap: true,
  format: 'iife', // formato compatible sin modules
  target: ['es2017'], // compatible con la mayoría de navegadores
}).then(() => {
  console.log('✅ Bundle generado correctamente.');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
