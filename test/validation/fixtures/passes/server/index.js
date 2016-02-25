// var express = require('mcap/express.js');
var express = require('express');
var app = express();
var gulp = require('gulp');

app.use(express.bodyParser());

/**
 * lists all available API.
 */
app.get('/', function( req, res ) {

    gulp.task('copy', function() {
      return gulp.src('./files/**')
        .pipe(gulp.dest('./dest/'));
    });

    gulp.run('copy', function() {
        res.send(arguments);
    });

});

//starts express webserver
app.listen(8080);
