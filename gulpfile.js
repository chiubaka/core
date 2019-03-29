const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");

const tsProject = ts.createProject("./tsconfig.json");

gulp.task("default", () => {
  return gulp.src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(tsProject())
    .once("error", function() {
      this.once("finish", () => process.exit(1));
    })
    .pipe(sourcemaps.write("dist"))
    .pipe(gulp.dest("dist"));
});