const { gulp, src, dest, lastRun, series, parallel, watch } = require("gulp");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const fileInclude = require("gulp-file-include");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const merge = require("merge-stream");
const browserSync = require("browser-sync").create();
const del = require("del");
const changed = require("gulp-changed");
const beautify = require("gulp-beautify");
const clean = require("gulp-clean");
const zip = require("gulp-zip");
const hash_src = require("gulp-hash-src");
const pxtorem = require("gulp-pxtorem");

const source = {
  path: "src/index_list/**/*.*",
  html: "src/html/**/*.html",
  css: "src/static/scss/",
  js: "src/static/js/",
  img: "src/static/img/",
  guide: "src/html/__guide/resources/",
  commonResource: "src/static/common/",
};

const dist = {
  path: "dist/index_list/",
  html: "dist/",
  css: "dist/static/css/",
  js: "dist/static/js/",
  img: "dist/static/img/",
  guide: "dist/html/__guide/resources/",
  commonResource: "dist/static/common/",
};

// html include
const htmlTask = () => {
  return src(source.html, { base: "src/" }, { since: lastRun(htmlTask) })
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(dest(dist.html))
    .pipe(browserSync.reload({ stream: true }));
};

// hash for Cache (build only)
const hash = () => {
  return src(dist.html + "/**/*.html")
    .pipe(
      hash_src({
        build_dir: "./dist",
        src_path: "./dist",
        exts: [".js", ".css", ".html"],
      }),
    )
    .pipe(dest("./dist"));
};

// CSS
const cssTask = () => {
  return src(source.css + "*.{scss,css}")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compact",
        indentType: "tab",
        indentWidth: 2,
        precision: 8,
        sourceComments: false,
      }).on("error", sass.logError),
    )
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(
      pxtorem({
        replace: true,
        rootValue: 10,
        unitPrecision: 4,
        minPixelValue: 1.1,
        selectorBlackList: ["html"],
        propList: [
          "font",
          "font-size",
          "line-height",
          "letter-spacing",
          "vertical-align",
          "margin*",
          "padding*",
          "width",
          "height",
          "min-width",
          "min-height",
          "max-width",
          "max-height",
          "background*",
          "box-shadow",
          "left",
          "right",
          "top",
          "bottom",
          "border*",
          "*radius",
          "column-gap",
          "grid-row-gap",
          "grid-gap",
          "grid-auto-rows",
          "grid-template-columns",
          "text-indent",
          "*flex*",
          "transform",
          "clip",
        ],
      }),
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest(dist.css))
    .pipe(browserSync.stream());
};

// JS
const jsTask = () => {
  return src(source.js + "*.js", { since: lastRun(jsTask) })
    .pipe(dest(dist.js))
    .pipe(beautify.js({ indent_size: 4 }))
    .pipe(browserSync.reload({ stream: true }));
};

// IMG
const imgTask = () => {
  return src(source.img + "**/*.{png,gif,jpg,ico,svg}")
    .pipe(dest(dist.img))
    .pipe(browserSync.reload({ stream: true }));
};

//Image Minify (build only)
const imgMinTask = () => {
  return src([source.img + "**/*.{png,gif,jpg,svg,ico}"], {
    since: lastRun(imgMinTask),
  })
    .pipe(newer(dist.img))
    .pipe(
      imagemin([imagemin.gifsicle({ interlaced: true }), imagemin.jpegtran({ progressive: true }), imagemin.optipng(), imagemin.svgo([{ removeViewBox: false }, { minifyStyles: false }])], {
        verbose: true,
      }),
    )
    .pipe(dest(dist.img))
    .pipe(browserSync.reload({ stream: true }));
};

//Guide resources file move
const guideTask = () => {
  return src(source.guide + "**/*.*")
    .pipe(dest(dist.guide))
    .pipe(browserSync.reload({ stream: true }));
};

/****************** Common [s] ******************/
const commonMove = () => {
  return src([source.commonResource + "**/*.*"])
    .pipe(dest(dist.commonResource))
    .pipe(browserSync.reload({ stream: true }));
};

const indexMove = () => {
  return src(["src/*.html"])
    .pipe(dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
};
const pathMove = () => {
  return src(source.path)
    .pipe(dest(dist.path))
    .pipe(browserSync.reload({ stream: true }));
};
/****************** Common [e] ******************/

// watch
const watchTask = () => {
  // watch(source.path, series(pathMove, hash));
  watch(source.path, series(pathMove));
  watch(source.commonResource, commonMove);
  watch(source.html, htmlTask);
  watch(source.guide, guideTask);
  watch(source.css, cssTask);
  watch(source.js, jsTask);
  watch(source.img, imgTask);
};

const cleanAllTask = () => {
  return del(["dist/"]);
};

// Server
const server = () => {
  return browserSync.init({
    port: 9999,
    server: {
      baseDir: "dist/",
    },
  });
};

/****************** Common [e] *****************/

// exports
exports.clean = cleanAllTask;

//FRONT
exports.default = series(cleanAllTask, pathMove, indexMove, commonMove, htmlTask, cssTask, jsTask, imgTask, guideTask, parallel(server, watchTask));

exports.build = series(cleanAllTask, pathMove, indexMove, commonMove, htmlTask, cssTask, jsTask, imgTask, imgMinTask, guideTask, series(clearChanged, allChanged, copyToOriginal, createZIP));

function allChanged() {
  return src("./dist/**/*.*")
    .pipe(changed("./_original", { hasChanged: changed.compareContents }))
    .pipe(dest("./_changed"));
}

function copyToOriginal() {
  return src("./_changed/**/*.*").pipe(dest("./_original"));
}

function createZIP() {
  let now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth() + 1;
  let d = now.getDate();
  let h = now.getHours();
  let mm = now.getMinutes();

  m = m <= 9 ? "0" + m : "" + m;
  d = d <= 9 ? "0" + d : "" + d;
  h = h <= 9 ? "0" + h : "" + h;
  mm = mm <= 9 ? "0" + mm : "" + mm;

  let filename = "out_pub." + y + m + d + h + mm + ".zip";

  return src("./_changed/**/*.*").pipe(zip(filename)).pipe(dest("./_zip"));
}

function clearChanged() {
  return src("./_changed/*", { read: false }).pipe(clean());
}
