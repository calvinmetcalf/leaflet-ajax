var fs = require("fs");

task('build', function() {
    fs.readdir("./src", function(e,f){
        var output = f.map(function(v){
           return fs.readFileSync("./src/"+v, "utf8");
        });
        fs.writeFile("./dist/leaflet.ajax.js", output.join("\n"), "utf8");
    });
});
task('default', ['build']);