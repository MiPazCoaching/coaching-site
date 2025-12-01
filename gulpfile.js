const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Importaciones condicionales con manejo de errores mejorado
let postcss, autoprefixer, cssnano, sourcemaps, rename, gulpif;

// Configuración
const config = {
    production: process.env.NODE_ENV === 'production',
    styles: {
        src: 'src/scss/main.scss',
        watch: 'src/scss/**/*.scss',
        dest: 'assets/css'
    }
};

// Función para cargar dependencias opcionales
function loadOptionalDeps() {
    try {
        postcss = require('gulp-postcss');
        autoprefixer = require('autoprefixer');
        cssnano = require('cssnano');
        sourcemaps = require('gulp-sourcemaps');
        rename = require('gulp-rename');
        gulpif = require('gulp-if');
        return true;
    } catch (error) {
        console.log('⚠️  Dependencias opcionales no instaladas: PostCSS y optimizaciones no disponibles');
        console.log('ℹ️  Para todas las funciones ejecuta: npm install --save-dev gulp-postcss autoprefixer cssnano gulp-sourcemaps gulp-rename gulp-if');
        return false;
    }
}

const hasOptionalDeps = loadOptionalDeps();

function compileSCSS() {
    console.log('🎨 Compilando SCSS...');
    console.log(`📁 Entrada: ${config.styles.src}`);
    console.log(`📁 Salida: ${config.styles.dest}`);
    console.log(`🏭 Modo: ${config.production ? 'Producción' : 'Desarrollo'}`);

    let stream = gulp.src(config.styles.src);

    // Sourcemaps solo en desarrollo y si está disponible
    if (!config.production && hasOptionalDeps) {
        stream = stream.pipe(sourcemaps.init());
        console.log('📝 Sourcemaps habilitados');
    }

    // Compilar Sass
    stream = stream.pipe(sass({
        outputStyle: config.production ? 'compressed' : 'expanded'
    }).on('error', function(error) {
        console.error('❌ Error en Sass:');
        console.error('   Mensaje:', error.message);
        console.error('   Archivo:', error.file);
        console.error('   Línea:', error.line);
        console.error('   Columna:', error.column);
        console.error('   Formatted:', error.formatted);
        this.emit('end');
    }));

    // PostCSS solo si está disponible
    if (hasOptionalDeps) {
        const processors = [autoprefixer()];
        if (config.production) {
            processors.push(cssnano({ preset: 'default' }));
            console.log('⚡ CSS minificado habilitado');
        }
        stream = stream.pipe(postcss(processors));
        console.log('🎯 Autoprefixer habilitado');
    }

    // Sourcemaps solo en desarrollo y si está disponible
    if (!config.production && hasOptionalDeps) {
        stream = stream.pipe(sourcemaps.write('.'));
    }

    // Guardar archivo principal
    stream = stream.pipe(gulp.dest(config.styles.dest))
        .on('end', () => {
            console.log(`✅ main.css compilado en: ${config.styles.dest}/main.css`);
        });

    // Minificar solo en producción y si está disponible
    if (config.production && hasOptionalDeps) {
        console.log('📦 Generando versión minificada...');
        const minStream = gulp.src(config.styles.src)
            .pipe(sass({
                outputStyle: 'compressed'
            }).on('error', function(error) {
                console.error('❌ Error al minificar:', error.message);
                this.emit('end');
            }))
            .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(config.styles.dest))
            .on('end', () => {
                console.log(`✅ main.min.css generado en: ${config.styles.dest}/main.min.css`);
            });
    }

    return stream;
}

function watch() {
    console.log('🔍 Buscando archivos SCSS...');
    console.log('📁 Observando:', config.styles.watch);

    // Compilar primero
    compileSCSS();

    return gulp.watch(config.styles.watch, {
        ignoreInitial: false,
        delay: 500 // Evitar múltiples compilaciones rápidas
    }, function(done) {
        console.log('\n🔄 Cambio detectado en SCSS, recompilando...');
        compileSCSS().on('end', () => {
            console.log('✅ Recompilación completada');
            done();
        });
    });
}

function cleanCSS(done) {
    const fs = require('fs');
    const path = require('path');

    console.log('🧹 Limpiando archivos CSS...');
    const cssDir = config.styles.dest;

    if (!fs.existsSync(cssDir)) {
        console.log('📁 Directorio no existe:', cssDir);
        return done();
    }

    try {
        const files = fs.readdirSync(cssDir);
        let deletedCount = 0;

        files.forEach(file => {
            if (file.endsWith('.css') || file.endsWith('.css.map')) {
                const filePath = path.join(cssDir, file);
                fs.unlinkSync(filePath);
                console.log(`🗑️  Eliminado: ${file}`);
                deletedCount++;
            }
        });

        if (deletedCount === 0) {
            console.log('📭 No se encontraron archivos CSS para limpiar');
        } else {
            console.log(`✅ Limpieza completada: ${deletedCount} archivos eliminados`);
        }
    } catch (error) {
        console.error('❌ Error al limpiar CSS:', error.message);
    }

    done();
}

// Función para verificar que todo está configurado correctamente
function checkSetup(done) {
    console.log('🔍 Verificando configuración...');

    const fs = require('fs');
    const path = require('path');

    // Verificar archivo de entrada
    if (!fs.existsSync(config.styles.src)) {
        console.error(`❌ Archivo fuente no encontrado: ${config.styles.src}`);
        console.error('   Crea el archivo o ajusta la ruta en el gulpfile.js');
        process.exit(1);
    }

    // Verificar dependencias
    if (!hasOptionalDeps) {
        console.warn('⚠️  Dependencias opcionales no instaladas');
        console.log('   Para instalar: npm install --save-dev gulp-postcss autoprefixer cssnano gulp-sourcemaps gulp-rename gulp-if');
    }

    // Verificar directorio de salida
    const destDir = config.styles.dest;
    if (!fs.existsSync(destDir)) {
        console.log(`📁 Creando directorio de salida: ${destDir}`);
        fs.mkdirSync(destDir, { recursive: true });
    }

    console.log('✅ Configuración verificada correctamente');
    done();
}

// Tareas específicas
exports.check = checkSetup;
exports.styles = gulp.series(checkSetup, compileSCSS);
exports.watch = gulp.series(checkSetup, watch);
exports.clean = cleanCSS;
exports.build = gulp.series(checkSetup, cleanCSS, compileSCSS);

// Tarea por defecto
exports.default = gulp.series(checkSetup, compileSCSS, watch);