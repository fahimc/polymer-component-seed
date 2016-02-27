var path = require('path');
var grunt;
var TaskRunner = {
	COMPONENT_NAME: 'seed-component',
	config: {
		shell: {
			polybuild: {
				command: 'polybuild src/<%= grunt.option(\'component_name\') %>.html'
			}
		},
		replace: {
			name: {
				options: {
					patterns: [{
						match: /seed-component/g,
						replacement: '<%= grunt.option(\'name\') %>'
					}]
				},
				files: [{
					expand: true,
					src: ['**/*.{html,xhtml,htm,js,css}', '!bower_components/**', '!node_modules/**']
				}]
			}
		},
		copy: {
			build: {
				expand: true,
				cwd: 'src',
				src: '*.build.*',
				dest: 'dist/',
			}
		},
		clean: {
			dist: {
				src: 'dist/**',
			},
			src: {
				src: 'src/*.build.*'
			}
		},
		connect: {
			all: {
				options: {
					port: 9000,
					hostname: "localhost",
					livereload: true
				}
			}
		},
		watch: {
			src: {
				files: ['src/**'],
				options: { livereload: true },
				tasks:['dist']
			},
			demo: {
				files: ['demo/**'],
				options: { livereload: true }
			},
			test: {
				files: ['test/**'],
				options: { livereload: true }
			}
		},
		open: {
			all: {
				path: 'http://localhost:<%= connect.all.options.port%>'
			}
		}

	},
	init: function (_grunt) {
		grunt = _grunt;
		grunt.option('component_name',TaskRunner.COMPONENT_NAME);
		this.loadNPMModules();
		grunt.initConfig(this.config);
		this.register();	
	},
	loadNPMModules: function () {
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-connect');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-replace');
		grunt.loadNpmTasks('grunt-shell-spawn');
		grunt.loadNpmTasks('grunt-open');
	},
	renameFiles: function () {
		
		var name = grunt.option('name');
		if(!name)
		{
			grunt.fail.fatal('No name specified', 1);
		}
		grunt.file.recurse(path.resolve('./'), this.onFile.bind(this));
	},
	onFile: function (abspath, rootdir, subdir, filename) {
		var name = grunt.option('name');
		if(filename.indexOf(this.COMPONENT_NAME) >=0)
		{
			var folderPath = abspath.substring(0,abspath.lastIndexOf('/'));
			var fileExtension = filename.substring(filename.lastIndexOf('.'),filename.length);
			console.log(folderPath + '/' + name + fileExtension);
			grunt.file.copy(abspath, folderPath + '/' + name + fileExtension);
		}
	},
	register: function () {
		grunt.registerTask('renameFiles', this.renameFiles.bind(this));
		grunt.registerTask('rename', ['renameFiles']);
		grunt.registerTask('serve', ['open','connect','watch']);
		grunt.registerTask('dist', ['shell:polybuild', 'clean:dist', 'copy:build','clean:src']);
		grunt.registerTask('develop', ['dist', 'serve']);
	}

};

module.exports = TaskRunner.init.bind(TaskRunner);