const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const merge = require("merge2");

const tsProject = ts.createProject("./tsconfig.json");

gulp.task("default", () => {
  const tsResult = gulp.src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return merge([
    tsResult.js
      .pipe(babel({
        presets: ["es2015"],
        plugins: ["transform-object-assign"],
      }))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"))
      .once("error", () => {
        this.once("finish", () => process.exit(1));
      }),
    tsResult.dts.
      pipe(gulp.dest("dist"))
      .once("error", () => {
        this.once("finish", () => process.exit(1));
      }),
  ]);
});