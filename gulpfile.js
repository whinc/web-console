const pkgInfo = require("./package.json");
const child_process = require("child_process");
const process = require("process");
var gulp = require("gulp");

gulp.task("default", function(cb) {
  // 将你的默认的任务代码放在这
});

let version = "prerelease";

gulp.task("version", cb => {
  const oldVersion = pkgInfo.version;
  console.log(oldVersion);
  console.log(process.argv, ";", process.argv0);
  child_process.exec("npm version " + version, (err, stdout, stderr) => {
    if (err) cb(err);
    console.log(stdout);
  });
});
