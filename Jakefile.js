var fs = require("fs"),
    uglifyjs = require('uglify-js'); 
task('build', {async: true}, function() {
    fs.readdir("./src", function(e,f){
        var output = f.map(function(v){
           return fs.readFileSync("./src/"+v, "utf8");
        });
        fs.writeFile("./dist/leaflet.ajax.js", output.join("\n"), "utf8", function(){complete();});
    });
});
task('min', ['build'], function(){
    fs.readFile('./dist/leaflet.ajax.js', 'utf8', function(e, j) {
        var ast = uglifyjs.parse(j);
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names();
        fs.writeFile('./dist/leaflet.ajax.min.js', ast.print_to_string());
        return console.log("minified");
    });
});
task('default', ['build']);