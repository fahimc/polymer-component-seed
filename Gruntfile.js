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
	register: function () {
		grunt.registerTask('rename', ['replace:name']);
		grunt.registerTask('serve', ['open','connect','watch']);
		grunt.registerTask('dist', ['shell:polybuild', 'clean:dist', 'copy:build','clean:src']);
		grunt.registerTask('develop', ['dist', 'serve']);
	}

};

module.exports = TaskRunner.init.bind(TaskRunner);