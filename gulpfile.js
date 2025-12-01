const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');
const path = require('path');

// Configuración
const config = {
    production: process.env.NODE_ENV === 'production',
    styles: {
        src: 'src/scss/main.scss',
        watch: 'src/scss/**/*.scss',
        dest: 'assets/css'
    }
};

// Verificar que el archivo fuente existe
function checkSourceFile() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Verificando archivo fuente...');
        console.log(`📁 Ruta: ${config.styles.src}`);

        if (!fs.existsSync(config.styles.src)) {
            const error = `❌ Archivo fuente no encontrado: ${config.styles.src}`;
            console.error(error);
            console.log('📋 Archivos disponibles en src/scss/:');

            try {
                const files = fs.readdirSync('src/scss/');
                files.forEach(file => console.log(`   - ${file}`));
            } catch (err) {
                console.error('❌ No se puede leer el directorio src/scss/');
            }

            reject(new Error(error));
        } else {
            console.log('✅ Archivo fuente encontrado');
            resolve();
        }
    });
}

// Verificar/crear directorio de destino
function checkDestDir() {
    return new Promise((resolve, reject) => {
        console.log('📁 Verificando directorio de destino...');

        const destDir = config.styles.dest;
        const destPath = path.dirname(destDir);

        try {
            // Crear directorios si no existen
            if (!fs.existsSync(destPath)) {
                console.log(`📁 Creando directorio: ${destPath}`);
                fs.mkdirSync(destPath, { recursive: true });
            }

            if (!fs.existsSync(destDir)) {
                console.log(`📁 Creando directorio: ${destDir}`);
                fs.mkdirSync(destDir, { recursive: true });
            }

            console.log(`✅ Directorio listo: ${destDir}`);
            resolve();
        } catch (error) {
            console.error(`❌ Error creando directorio: ${error.message}`);
            reject(error);
        }
    });
}

// Compilar SCSS con mejor manejo de errores
function compileSCSS() {
    console.log('\n🎨 COMPILANDO SCSS...');
    console.log(`📁 Entrada: ${config.styles.src}`);
    console.log(`📁 Salida: ${config.styles.dest}`);
    console.log(`🏭 Modo: ${config.production ? 'PRODUCCIÓN' : 'DESARROLLO'}`);

    return checkSourceFile()
        .then(() => checkDestDir())
        .then(() => {
            return new Promise((resolve, reject) => {
                gulp.src(config.styles.src)
                    .pipe(sass({
                        outputStyle: config.production ? 'compressed' : 'expanded',
                        includePaths: ['node_modules']
                    }).on('error', function(error) {
                        console.error('\n❌ ERROR EN SASS:');
                        console.error(`   📄 Archivo: ${error.file}`);
                        console.error(`   📍 Línea: ${error.line}, Columna: ${error.column}`);
                        console.error(`   💬 Mensaje: ${error.message}`);
                        console.error(`   🔍 Formateado: ${error.formatted}`);

                        // Mostrar contenido del archivo problemático si es posible
                        if (error.file && fs.existsSync(error.file)) {
                            try {
                                const content = fs.readFileSync(error.file, 'utf8');
                                const lines = content.split('\n');
                                const startLine = Math.max(0, error.line - 3);
                                const endLine = Math.min(lines.length, error.line + 2);

                                console.error('\n📄 Fragmento del archivo:');
                                for (let i = startLine; i < endLine; i++) {
                                    const indicator = (i + 1 === error.line) ? '>>>' : '   ';
                                    console.error(`${indicator} ${i + 1}: ${lines[i]}`);
                                }
                            } catch (readError) {
                                console.error('❌ No se pudo leer el archivo para mostrar contexto');
                            }
                        }

                        this.emit('end');
                        reject(error);
                    }))
                    .pipe(gulp.dest(config.styles.dest))
                    .on('end', () => {
                        console.log('\n✅ COMPILACIÓN COMPLETADA');

                        // Verificar que se creó el archivo
                        const outputFile = path.join(config.styles.dest, 'main.css');
                        if (fs.existsSync(outputFile)) {
                            const stats = fs.statSync(outputFile);
                            console.log(`📊 main.css generado: ${stats.size} bytes`);
                            console.log(`📁 Ubicación: ${outputFile}`);

                            // Mostrar primeras líneas para verificación
                            const content = fs.readFileSync(outputFile, 'utf8');
                            const lines = content.split('\n').slice(0, 5);
                            console.log('\n📄 Primeras líneas del CSS:');
                            lines.forEach(line => console.log(`   ${line}`));

                            resolve();
                        } else {
                            const error = `❌ Archivo no generado: ${outputFile}`;
                            console.error(error);
                            reject(new Error(error));
                        }
                    })
                    .on('error', reject);
            });
        });
}

// Tarea para limpiar CSS
function cleanCSS() {
    console.log('🧹 Limpiando archivos CSS...');

    const cssDir = config.styles.dest;

    if (!fs.existsSync(cssDir)) {
        console.log('📁 Directorio no existe, omitiendo limpieza');
        return Promise.resolve();
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

        return Promise.resolve();
    } catch (error) {
        console.error('❌ Error al limpiar CSS:', error.message);
        return Promise.reject(error);
    }
}

// Tarea para verificar estructura del proyecto
function checkProjectStructure() {
    console.log('📋 VERIFICANDO ESTRUCTURA DEL PROYECTO...');

    const requiredDirs = [
        'src/scss',
        'assets'
    ];

    const requiredFiles = [
        'src/scss/main.scss',
        'package.json',
        'gulpfile.js'
    ];

    let allOk = true;

    // Verificar directorios
    requiredDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            console.log(`✅ Directorio: ${dir}`);
        } else {
            console.error(`❌ Directorio faltante: ${dir}`);
            allOk = false;
        }
    });

    // Verificar archivos
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ Archivo: ${file}`);
        } else {
            console.error(`❌ Archivo faltante: ${file}`);
            allOk = false;
        }
    });

    // Verificar dependencias
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['gulp', 'sass', 'gulp-sass'];

        console.log('\n📦 VERIFICANDO DEPENDENCIAS...');
        requiredDeps.forEach(dep => {
            if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
                console.log(`✅ Dependencia: ${dep}@${packageJson.devDependencies[dep]}`);
            } else if (packageJson.dependencies && packageJson.dependencies[dep]) {
                console.log(`✅ Dependencia: ${dep}@${packageJson.dependencies[dep]}`);
            } else {
                console.error(`❌ Dependencia faltante: ${dep}`);
                allOk = false;
            }
        });
    } catch (error) {
        console.error('❌ Error leyendo package.json:', error.message);
        allOk = false;
    }

    if (!allOk) {
        return Promise.reject(new Error('Estructura del proyecto incompleta'));
    }

    console.log('\n✅ ESTRUCTURA VERIFICADA CORRECTAMENTE');
    return Promise.resolve();
}

// Tareas específicas
exports.check = checkProjectStructure;
exports.styles = gulp.series(checkProjectStructure, compileSCSS);
exports.clean = cleanCSS;
exports.build = gulp.series(cleanCSS, compileSCSS);

// Tarea por defecto
exports.default = compileSCSS;