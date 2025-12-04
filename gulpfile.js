/**
 * ------------------------------------------
 *  GULPFILE - Sistema completo para SCSS + Nunjucks + i18n
 * ------------------------------------------
 */


// ============================================
// 1. CARGAR VARIABLES DE ENTORNO AL INICIO
// ============================================
require('dotenv').config();

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const nunjucksRender = require("gulp-nunjucks-render");
const data = require("gulp-data");
const fs = require("fs");
const path = require("path");
const through = require("through2");
const browserSync = require("browser-sync").create();

// Helper para noop (operación vacía)
const noop = require("gulp-util").noop || (() => through.obj());

// ============================================
// 2. CONFIGURACIÓN CON VARIABLES DE ENTORNO
// ============================================

// Verificar si estamos en modo producción
const isProd = process.env.NODE_ENV === "production";

const config = {
    // Entorno
    isProduction: isProd,

    // Google Analytics (desde .env)
    googleAnalyticsId: process.env.GA_ID || (isProd ? '' : 'G-DEMO12345'),

    // URLs del sitio
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    siteName: process.env.SITE_NAME || 'Marta Paz Ogle',

    // Email (opcional, desde .env)
    contactEmail: process.env.CONTACT_EMAIL,

    // Contacto adicional
    contactPhone: process.env.CONTACT_PHONE',

    // Calendly (opcional)
    calendlyUrl: process.env.CALENDLY_URL || 'https://calendly.com/martapazogle',

    // Rutas
    paths: {
        scss: {
            src: "src/scss/main.scss",
            watch: "src/scss/**/*.scss",
            dest: "assets/css"
        },
        templates: {
            pages: "src/templates/pages/**/*.+(njk|html)",
            partials: "src/templates/**/*.njk",
            watch: "src/templates/**/*.+(njk|html|json)",
            dest: "./"
        },
        translations: "./src/templates/translations.json",
        assets: {
            js: "assets/js/**/*.js",
            images: "assets/images/**/*",
            icons: "assets/icons/**/*"
        }
    },

    // Configuración de entorno
    env: {
        production: isProd,
        development: !isProd,
        nodeEnv: process.env.NODE_ENV || 'development',
        gaEnabled: !!process.env.GA_ID
    },

    // BrowserSync (solo desarrollo)
    browserSync: {
        port: 3000,
        server: {
            baseDir: "./",
            index: "index.html"
        },
        open: true,
        notify: false,
        ghostMode: false
    }
};

// ============================================
// 3. VERIFICAR CONFIGURACIÓN
// ============================================
console.log('🔧 Configuración cargada:');
console.log('- Entorno:', config.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('- GA ID:', config.googleAnalyticsId ? '✅ Configurado' : '⚠️ No configurado');
console.log('- Site URL:', config.siteUrl);
console.log('- Contact Email:', config.contactEmail);

/* ------------------------------------------
   FUNCIONES AUXILIARES
--------------------------------------------- */

// Función para verificar que un archivo/directorio existe
function checkFileExists(filePath, description) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ ${description} no encontrado: ${filePath}`);
        throw new Error(`${description} no encontrado: ${filePath}`);
    }
    console.log(`✅ ${description}: ${filePath}`);
    return true;
}

// Función para verificar/crear directorios
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`📁 Creando directorio: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
        return true;
    }
    return false;
}

// Función para limpiar cache
function clearCache() {
    console.log('🗑️  Limpiando cache...');
    delete require.cache[require.resolve('sass')];
    delete require.cache[require.resolve('gulp-sass')];
    delete require.cache[require.resolve('gulp-nunjucks-render')];
    if (config.paths.translations && fs.existsSync(config.paths.translations)) {
        delete require.cache[require.resolve(path.resolve(config.paths.translations))];
    }
}

// Función para extraer front matter de archivos .njk
function extractFrontMatter(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontMatterRegex);

        if (match) {
            const frontMatterContent = match[1];
            const data = {};

            frontMatterContent.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim().replace(/^['"](.*)['"]$/, '$1');
                    data[key] = value;
                }
            });

            return {
                data: data,
                content: content.substring(match[0].length)
            };
        }

        return { data: {}, content: content };
    } catch (error) {
        console.error(`❌ Error leyendo archivo ${filePath}:`, error.message);
        return { data: {}, content: '' };
    }
}

/* ------------------------------------------
   VERIFICACIONES DE PROYECTO
--------------------------------------------- */

// Verificar estructura completa del proyecto
function checkProjectStructure() {
    console.log('📋 VERIFICANDO ESTRUCTURA DEL PROYECTO...');

    try {
        // Verificar directorios requeridos
        const requiredDirs = [
            'src/scss',
            'src/templates',
            'src/templates/pages',
            'src/templates/partials',
            'assets'
        ];

        requiredDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                console.log(`📁 Creando directorio: ${dir}`);
                fs.mkdirSync(dir, { recursive: true });
            }
            console.log(`✅ Directorio: ${dir}`);
        });

        // Verificar archivos requeridos
        if (!checkFileExists(config.paths.scss.src, "Archivo SCSS principal")) {
            console.log('📝 Creando archivo SCSS principal...');
            const scssDir = path.dirname(config.paths.scss.src);
            ensureDirectoryExists(scssDir);
            fs.writeFileSync(config.paths.scss.src, '/* Estilos principales */\nbody { margin: 0; }');
        }

        if (!checkFileExists(config.paths.translations, "Archivo de traducciones")) {
            console.log('📝 Creando archivo de traducciones...');
            const translationsDir = path.dirname(config.paths.translations);
            ensureDirectoryExists(translationsDir);
            fs.writeFileSync(config.paths.translations, JSON.stringify({
                es: { nav: { home: 'Inicio' }, site: { brand: 'Marta Paz Ogle' } },
                en: { nav: { home: 'Home' }, site: { brand: 'Marta Paz Ogle' } },
                fr: { nav: { home: 'Accueil' }, site: { brand: 'Marta Paz Ogle' } }
            }, null, 2));
        }

        checkFileExists('package.json', "Archivo package.json");
        checkFileExists('gulpfile.js', "Archivo gulpfile.js");

        // Verificar dependencias en package.json
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['gulp', 'sass', 'gulp-sass', 'gulp-nunjucks-render', 'gulp-data'];

        console.log('\n📦 VERIFICANDO DEPENDENCIAS...');
        requiredDeps.forEach(dep => {
            const allDeps = {
                ...(packageJson.dependencies || {}),
                ...(packageJson.devDependencies || {})
            };

            if (allDeps[dep]) {
                console.log(`✅ Dependencia: ${dep}@${allDeps[dep]}`);
            } else {
                console.error(`❌ Dependencia faltante: ${dep}`);
                throw new Error(`Dependencia faltante: ${dep}`);
            }
        });

        console.log('\n✅ ESTRUCTURA VERIFICADA CORRECTAMENTE');
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Error en verificación:', error.message);
        return Promise.reject(error);
    }
}

/* ------------------------------------------
   MANEJO DE TRADUCCIONES
--------------------------------------------- */

// Cargar todas las traducciones
function getTranslations() {
    try {
        if (!fs.existsSync(config.paths.translations)) {
            console.warn('⚠️  Archivo de traducciones no encontrado, creando uno básico...');
            const basicTranslations = {
                es: {
                    nav: { home: 'Inicio', about: 'Sobre mí', services: 'Servicios', contact: 'Contacto', blog: 'Blog' },
                    site: { brand: 'Marta Paz Ogle', tagline: 'Coaching Personal y Profesional' }
                },
                en: {
                    nav: { home: 'Home', about: 'About Me', services: 'Services', contact: 'Contact', blog: 'Blog' },
                    site: { brand: 'Marta Paz Ogle', tagline: 'Personal & Professional Coaching' }
                },
                fr: {
                    nav: { home: 'Accueil', about: 'À propos', services: 'Services', contact: 'Contact', blog: 'Blog' },
                    site: { brand: 'Marta Paz Ogle', tagline: 'Coaching Personnel et Professionnel' }
                }
            };
            fs.writeFileSync(config.paths.translations, JSON.stringify(basicTranslations, null, 2));
            return basicTranslations;
        }

        const translations = JSON.parse(
            fs.readFileSync(config.paths.translations, "utf8")
        );
        console.log('🌍 Traducciones cargadas. Idiomas disponibles:');
        Object.keys(translations).forEach(lang => {
            const keys = Object.keys(translations[lang]);
            console.log(`   - ${lang}: ${keys.length} textos`);
        });
        return translations;
    } catch (error) {
        console.error('❌ Error cargando traducciones:', error.message);
        throw error;
    }
}

/* ------------------------------------------
   COMPILAR SCSS CON VERIFICACIONES
--------------------------------------------- */
function compileSCSS() {
    console.log('\n🎨 COMPILANDO SCSS...');
    console.log(`📁 Entrada: ${config.paths.scss.src}`);
    console.log(`📁 Salida: ${config.paths.scss.dest}`);
    console.log(`🏭 Modo: ${config.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);

    // Verificar archivo fuente
    if (!fs.existsSync(config.paths.scss.src)) {
        console.error(`❌ Archivo SCSS no encontrado: ${config.paths.scss.src}`);
        return Promise.reject(new Error(`Archivo SCSS no encontrado: ${config.paths.scss.src}`));
    }

    // Asegurar directorio de destino
    ensureDirectoryExists(config.paths.scss.dest);

    // Limpiar cache antes de compilar
    clearCache();

    return gulp
        .src(config.paths.scss.src)
        .pipe(config.isProduction ? sourcemaps.init() : noop())
        .pipe(
            sass({
                outputStyle: config.isProduction ? 'compressed' : 'expanded',
                includePaths: ["node_modules"],
                precision: 10
            }).on('error', function(error) {
                console.error('\n❌ ERROR EN SASS:');
                console.error(`   📄 Archivo: ${error.file}`);
                console.error(`   📍 Línea: ${error.line}, Columna: ${error.column}`);
                console.error(`   💬 Mensaje: ${error.message}`);

                // Mostrar contexto del error
                if (error.file && fs.existsSync(error.file)) {
                    try {
                        const content = fs.readFileSync(error.file, 'utf8');
                        const lines = content.split('\n');
                        const start = Math.max(0, error.line - 3);
                        const end = Math.min(lines.length, error.line + 2);

                        console.error('\n📄 Contexto del error:');
                        for (let i = start; i < end; i++) {
                            const marker = i + 1 === error.line ? '>>>' : '   ';
                            console.error(`${marker} ${i + 1}: ${lines[i]}`);
                        }
                    } catch (e) {
                        console.error('No se pudo leer el archivo para contexto');
                    }
                }

                this.emit('end');
            })
        )
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', '> 1%', 'IE 11'],
            cascade: false
        }))
        .pipe(config.isProduction ? cleanCSS({
            compatibility: 'ie11',
            level: 2
        }) : noop())
        .pipe(config.isProduction ? sourcemaps.write(".") : noop())
        .pipe(gulp.dest(config.paths.scss.dest))
        .on('end', () => {
            const outputFile = path.join(config.paths.scss.dest, 'main.css');
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                console.log(`\n✅ CSS COMPILADO EXITOSAMENTE`);
                console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
                console.log(`📁 Ubicación: ${outputFile}`);

                // Recargar BrowserSync si está activo
                if (browserSync.active) {
                    browserSync.reload('*.css');
                }
            } else {
                console.error(`❌ Archivo no generado en: ${outputFile}`);
            }
        })
        .pipe(browserSync.stream ? browserSync.stream() : noop());
}

/* ------------------------------------------
   COMPILAR TEMPLATES CON TRADUCCIONES Y VARIABLES DE ENTORNO
--------------------------------------------- */
function compileTemplates() {
    console.log('\n📄 COMPILANDO TEMPLATES...');

    try {
        // Cargar traducciones primero
        const allTranslations = getTranslations();

        return gulp
            .src(config.paths.templates.pages)
            .pipe(data(function(file) {
                try {
                    const fileExt = path.extname(file.path);
                    const fileName = path.basename(file.path, fileExt);
                    const fileDir = path.dirname(file.path);

                    // Detectar idioma basado en estructura de carpetas
                    let lang = 'es';
                    const langMatch = fileDir.match(/\/(es|en|fr)(?:\/|$)/);
                    if (langMatch) {
                        lang = langMatch[1];
                    }

                    // Extraer slug del nombre del archivo
                    let slug = fileName;
                    const slugMatch = fileName.match(/^([^\.]+)/);
                    if (slugMatch) {
                        slug = slugMatch[1];
                    }

                    // Extraer front matter si es .njk
                    let frontMatter = { title: '', description: '' };
                    if (fileExt === '.njk') {
                        const extracted = extractFrontMatter(file.path);
                        frontMatter = extracted.data;
                    }

                    console.log(`   📄 Procesando: ${fileName}${fileExt} (${lang})`);

                    // Datos para el template
                    const templateData = {
                        // Metadatos
                        lang: lang,
                        slug: slug,
                        current_page: slug,

                        // Front matter
                        title: frontMatter.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)} - ${config.siteName}`,
                        description: frontMatter.description || '',

                        // Variables de entorno
                        env: config.env,
                        googleAnalyticsId: config.googleAnalyticsId,
                        site: {
                            url: config.siteUrl,
                            name: config.siteName,
                            email: config.contactEmail,
                            phone: config.contactPhone,
                            calendly: config.calendlyUrl
                        },

                        // Traducciones
                        t: allTranslations[lang] || allTranslations['es'] || {}
                    };

                    return templateData;
                } catch (error) {
                    console.error(`❌ Error procesando ${file.path}:`, error.message);
                    return {
                        lang: 'es',
                        slug: 'error',
                        t: {},
                        env: config.env,
                        site: {
                            url: config.siteUrl,
                            name: config.siteName,
                            email: config.contactEmail
                        }
                    };
                }
            }))
            .pipe(nunjucksRender({
                path: ["src/templates"],
                ext: ".html",
                envOptions: {
                    watch: false,
                    noCache: config.isProduction,
                    autoescape: false
                },
                manageEnv: function(env) {
                    // Añadir filtros personalizados a Nunjucks
                    env.addFilter('json', function(value) {
                        return JSON.stringify(value);
                    });

                    env.addFilter('date', function(value, format) {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    });

                    return env;
                }
            }))
            .on('error', function(error) {
                console.error('\n❌ ERROR EN TEMPLATE:');
                console.error(`   📄 Archivo: ${error.file || 'Desconocido'}`);
                console.error(`   💬 Mensaje: ${error.message}`);
                this.emit('end');
            })
            .pipe(gulp.dest(config.paths.templates.dest))
            .on('end', () => {
                console.log('✅ TEMPLATES COMPILADOS EXITOSAMENTE');

                // Recargar BrowserSync si está activo
                if (browserSync.active) {
                    browserSync.reload();
                }
            });
    } catch (error) {
        console.error('❌ Error compilando templates:', error.message);
        throw error;
    }
}

/* ------------------------------------------
   LIMPIAR ARCHIVOS GENERADOS
--------------------------------------------- */
function cleanGeneratedFiles() {
    console.log('🧹 LIMPIANDO ARCHIVOS GENERADOS...');

    const filesToDelete = [];

    try {
        // Limpiar CSS
        if (fs.existsSync(config.paths.scss.dest)) {
            const files = fs.readdirSync(config.paths.scss.dest);
            files.forEach(file => {
                if (file.endsWith('.css') || file.endsWith('.css.map')) {
                    const filePath = path.join(config.paths.scss.dest, file);
                    filesToDelete.push(filePath);
                }
            });
        }

        // Limpiar HTML generado (buscar archivos .html en la raíz y subdirectorios)
        const findHtmlFiles = (dir) => {
            if (!fs.existsSync(dir)) return;

            const items = fs.readdirSync(dir, { withFileTypes: true });
            items.forEach(item => {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    findHtmlFiles(fullPath);
                } else if (item.name.endsWith('.html') && !fullPath.includes('node_modules')) {
                    filesToDelete.push(fullPath);
                }
            });
        };

        findHtmlFiles('.');

        // Eliminar archivos
        filesToDelete.forEach(filePath => {
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️  Eliminado: ${path.relative('.', filePath)}`);
            } catch (err) {
                console.error(`   ❌ Error eliminando ${filePath}:`, err.message);
            }
        });

        if (filesToDelete.length === 0) {
            console.log('📭 No se encontraron archivos para limpiar');
        } else {
            console.log(`✅ Limpieza completada: ${filesToDelete.length} archivos eliminados`);
        }

        return Promise.resolve();
    } catch (error) {
        console.error('❌ Error en limpieza:', error.message);
        return Promise.reject(error);
    }
}

/* ------------------------------------------
   SERVIDOR DE DESARROLLO CON BROWSER SYNC
--------------------------------------------- */
function serve(done) {
    if (config.isProduction) {
        console.log('⚠️  BrowserSync solo está disponible en modo desarrollo');
        return done();
    }

    browserSync.init(config.browserSync);
    console.log(`🚀 Servidor iniciado en: ${config.siteUrl}`);
    console.log('👁️  Modo watch activado');
    done();
}

/* ------------------------------------------
   WATCHER (DESARROLLO)
--------------------------------------------- */
function watchFiles() {
    if (config.isProduction) {
        console.log('⚠️  Modo watch solo disponible en desarrollo');
        return;
    }

    console.log('\n👁️  INICIANDO MODO WATCH...');
    console.log('   - SCSS: Se recompilará al detectar cambios');
    console.log('   - Templates: Se recompilarán al detectar cambios');
    console.log('   - Traducciones: Se recargarán automáticamente');
    console.log('   - BrowserSync: Recargará automáticamente');
    console.log('\n🔄 Esperando cambios...\n');

    // Observar cambios en SCSS
    gulp.watch(config.paths.scss.watch, compileSCSS);

    // Observar cambios en templates
    gulp.watch(config.paths.templates.watch, compileTemplates);

    // Observar cambios en traducciones
    gulp.watch(config.paths.translations, compileTemplates);

    // Observar cambios en archivos HTML generados
    gulp.watch("*.html").on('change', browserSync.reload);

    // Observar cambios en JavaScript
    gulp.watch(config.paths.assets.js).on('change', browserSync.reload);
}

/* ------------------------------------------
   TAREAS PÚBLICAS
--------------------------------------------- */

// Tarea de verificación
exports.check = checkProjectStructure;

// Tarea para solo estilos
exports.styles = gulp.series(checkProjectStructure, compileSCSS);

// Tarea para solo templates
exports.templates = gulp.series(checkProjectStructure, compileTemplates);

// Tarea para limpiar
exports.clean = cleanGeneratedFiles;

// Tarea de servidor de desarrollo
exports.serve = gulp.series(
    checkProjectStructure,
    cleanGeneratedFiles,
    gulp.parallel(compileSCSS, compileTemplates),
    serve,
    watchFiles
);

// Tarea de desarrollo (sin servidor)
exports.watch = gulp.series(
    checkProjectStructure,
    cleanGeneratedFiles,
    gulp.parallel(compileSCSS, compileTemplates),
    watchFiles
);

// Tarea de construcción para producción
exports.build = gulp.series(
    checkProjectStructure,
    cleanGeneratedFiles,
    gulp.parallel(compileSCSS, compileTemplates)
);

// Tarea por defecto (construcción simple)
exports.default = gulp.series(
    checkProjectStructure,
    cleanGeneratedFiles,
    gulp.parallel(compileSCSS, compileTemplates)
);

// Tarea para crear estructura inicial
exports.init = gulp.series(checkProjectStructure);

// Tarea para desarrollo completo (con servidor)
exports.dev = exports.serve;