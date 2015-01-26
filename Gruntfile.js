'use strict';

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: [
					'bower.json'
				],
				tasks: [
					'wiredep'
				]
			},
			assemble: {
				files: '<%= config.app %>/templates/**/*.hbs',
				tasks: ['assemble:server'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
			},
			js: {
				files: [
					'<%= config.app %>/js/{,*/}*.js'
				],
				tasks: [
					'newer:jshint:all'
				],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			compass: {
				files: [
					'<%= config.app %>/css/{,*/}*.{scss,sass}'
				],
				tasks: [
					'compass:server', 
					'autoprefixer'
				]
			},
			gruntfile: {
				files: [
					'Gruntfile.js'
				]
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/{,*/}*.html',
					'.tmp/css/{,*/}*.css',
					'<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= config.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= config.app %>/js/{,*/}*.js'
				]
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/{,*/}*',
						'!<%= config.dist %>/.git{,*/}*'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: [
					'last 1 version'
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/css/',
					src: '{,*/}*.css',
					dest: '.tmp/css/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: [
					'<%= config.app %>/templates/**/*.hbs'
				],
				ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/
			},
			sass: {
				src: [
					'<%= config.app %>/css/{,*/}*.{scss,sass}'
				],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= config.app %>/css',
				cssDir: '.tmp/css',
				generatedImagesDir: '.tmp/img/generated',
				imagesDir: '<%= config.app %>/img',
				javascriptsDir: '<%= config.app %>/js',
				fontsDir: '<%= config.app %>/css/fonts',
				importPath: './bower_components',
				httpImagesPath: '/img',
				httpGeneratedImagesPath: '/img/generated',
				httpFontsPath: '/css/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
			dist: {
				options: {
					generatedImagesDir: '<%= config.dist %>/img/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= config.dist %>/js/{,*/}*.js',
					'<%= config.dist %>/css/{,*/}*.css',
					'<%= config.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= config.dist %>/css/fonts/*'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= config.app %>/templates/layouts/default.hbs',
			options: {
				dest: '<%= config.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: [
				'<%= config.dist %>/{,*/}*.html'
			],
			css: [
				'<%= config.dist %>/css/{,*/}*.css'
			],
			options: {
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/img'
				]
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/img',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= config.dist %>/img'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/img',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/img'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: [
						'*.html', 
						'views/{,*/}*.html'
					],
					dest: '<%= config.dist %>'
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= config.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,txt}',
                        '!favicon.png',
						'.htaccess',
						'*.html',
						'img/{,*/}*.{webp}',
						'fonts/{,*/}*.*'
					]
				}, {
					expand: true,
					cwd: '.tmp/img',
					dest: '<%= config.dist %>/img',
					src: [
						'generated/*'
					]
				}, {
                    expand: true,
                    cwd: 'bower_components/fontawesome/fonts',
                    src: '*.*',
                    dest: '<%= config.dist %>/fonts'
                }]
			},
			styles: {
				expand: true,
				cwd: '<%= config.app %>/css',
				dest: '.tmp/css/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server'
			],
			dist: [
				'compass:dist',
				'imagemin',
				'svgmin'
			]
		},
        
		assemble: {
			options: {
                layout: '<%= config.app %>/templates/layouts/default.hbs',
				partials: '<%= config.app %>/templates/partials/**/*.hbs',
				flatten: true,
				data: '<%= config.app %>/data/**/*.json'
			},
			dist: {
				files: {
					'<%= config.dist %>/': ['<%= config.app %>/templates/pages/*.hbs']
				}
			},
			server: {
				files: {
					'.tmp/': ['<%= config.app %>/templates/pages/*.hbs']
				}
			}
		},
        
        favicons: {
            options: {
                windowsTile: false,
                
            },
            server: {
                src: '<%= config.app %>/favicon.png',
                dest: '.tmp',
                options: {
                    html: '.tmp/index.html'
                }
            },
            dist: {
                src: '<%= config.app %>/favicon.png',
                dest: '<%= config.dist %>',
                options: {
                    html: '<%= config.dist %>/index.html'
                }
            }
        },

	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
		
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'wiredep',
            'assemble:server',
            'favicons:server',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
		
	});

	grunt.registerTask('build', [
		'clean:dist',
		'wiredep',
        'assemble:dist',
        'favicons:dist',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'copy:dist',
		'cdnify',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'build'
	]);
};