const { src, dest, watch, parallel } = require("gulp");
//css
const sass = require("gulp-sass")(require("sass"));
const plumer = require("gulp-plumber");
const autoprefixer = require("autoprefixer"); //Hace que funcione en cualquier navegador
const cssnano = require("cssnano"); //comprime nuestro css
const postcss = require("gulp-postcss"); //hacer las transformaciones
const sourcemaps = require("gulp-sourcemaps");
//Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

//Javascript
const terser = require("gulp-terser-js");

function css(done) {
  src("src/scss/**/*.scss") //Identification file sass
    .pipe(sourcemaps.init()) //
    .pipe(plumer())
    .pipe(sass()) //compilar
    .pipe(postcss([autoprefixer(), cssnano()])) //
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); //Save

  done();
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };
  src("src/img/**/*.{png,jpg}") //scearch img in the folder src/img
    .pipe(cache(imagemin(opciones))) //Covert img a format more small
    .pipe(dest("build/img")); //Save in the folder name
  done();
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}") //scearch img in the folder src/img
    .pipe(webp(opciones)) //Covert img a format webp
    .pipe(dest("build/img")); //Save in the folder name

  done();
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}") //scearch img in the folder src/img
    .pipe(avif(opciones)) //Covert img a format avif
    .pipe(dest("build/img")); //Save in the folder name

  done();
}

function javascript(done) {
  src("src/js/**/*.js") //Identification file sass
    .pipe(sourcemaps.init())//
    .pipe(terser()) ///
    .pipe(sourcemaps.write('.'))//
    .pipe(dest("build/js")); //Save

  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
