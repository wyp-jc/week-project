var gulp =require('gulp');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-minify-css')
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var sass = require('gulp-sass')
var webserver=require('gulp-webserver')
var browserify=require('gulp-browserify')
var rev=require('gulp-rev')
var revCollector=require('gulp-rev-collector')
var Mock=require('mockjs')
gulp.task('htmlmin', function() {
  	gulp.src('src/html/*.html')
    	.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest('dist/html'));
});
gulp.task('cssmin',function(){
	gulp.src('src/css/*.css')
    	.pipe(cssmin())
    	.pipe(rev())
    	.pipe(gulp.dest('dist/css'))
    	.pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));

})
gulp.task('imgmin',function(){
	 gulp.src('src/images/*')
         .pipe(imagemin())
         .pipe(gulp.dest('dist/images'))
})
gulp.task('jsmin',function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('dist/js/'))
		.pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
})
gulp.task('rev',['jsmin','cssmin'],function () {
    gulp.src(['rev/**/*.json', 'dist/**/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'dist/css/',
                'js': 'dist/js/'
                
            }
        }) )
        .pipe(gulp.dest('dist'));
});
gulp.task('sass',function(){
	gulp.src('src/css/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'))
		
})
gulp.task('server',['htmlmin','rev','sass','imgmin'],function(){
	setTimeout(function(){
		gulp.watch('src/css/*.css',['rev'])
		gulp.watch('src/js/*.js',['rev'])
		gulp.watch('src/html/*.html',['htmlmin'])
		gulp.src('dist')
			.pipe(webserver({
		      livereload: true,
		      directoryListing: true,
		      middleware:function(req,res,next){
		      		var Random = Mock.Random;
						Random.integer();
						Random.string('lower',4);
						Random.date('yyyy-MM-dd');
						var data = Mock.mock({
							"menuList|6":[{
								'menuNav':'@string("lower",4)',
								'menuNavContent|1-5':[{
									'url':'index.html',
									'name':"@string('lower',4)",
									'id':'@integer(0,10)'
								}]
							}]
						})
					  	res.writeHead(200,{
					  		"Content-type":"application/json;charset=UTF-8",
					  		"Access-Control-Allow-Origin":"*"
					  	})
					  	res.write(JSON.stringify(data));
					  	res.end();
		      },
		      open: '/html/index.html'
		    }));
	},2000)
	
})

			

