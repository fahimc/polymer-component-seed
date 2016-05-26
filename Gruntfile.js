var path = require('path');
var grunt;
var TaskRunner = {
	COMPONENT_NAME: 'seed-component',
	config: {
		shell: {
			polybuild: {
				command: 'polybuild src/<%= grunt.option(\'component_name\') %>.html'
			},
			switchToMaster: {
                command: 'git checkout master'
            },
            pullMaster: {
                command: 'git pull origin'
            },
			gitMerge: {
				command: 'git merge develop'
			},
			getMergeWithMaster: {
				command : 'git merge -s ours --no-commit master'
			},
			commitDevelopBranch: {
				command: 'git commit -m "merged master"'
			},
			gitCommit: {
				command: 'git add -A && git commit -m "merge and release from develop"'
			},
			gitPush: {
				command: 'git push origin master'
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
					src: ['**/*.{html,xhtml,htm,js,css}', '!bower_components/**', '!node_modules/**', 'Gruntfile.js', '!package.json', '!bower.json']
				}]
			},
			release: {
				options: {
					patterns: [{
						match: /dist\//g,
						replacement: ''
					}]
				},
				files: [{
					expand: true,
					src: ['demo/index.html']
				}]
			},
			releaseBuild: {
				options: {
					patterns: [{
						match: /\.build\./g,
						replacement: '.'
					}]
				},
				files: [{
					expand: true,
					src: ['*.html']
				}]
			},
			distBuild: {
				options: {
					patterns: [{
						match: /\.build\./g,
						replacement: '.'
					}]
				},
				files: [{
					expand: true,
					src: ['dist/*.html']
				}]
			}
		},
		copy: {
			build: {
				expand: true,
				cwd: 'src',
				src: '*.build.*',
				dest: 'dist/'
			},
			resource: {
                expand: true,
                cwd: 'src',
                src: 'resource/**/*',
                dest: 'dist'
            },
			dist: {
				expand: true,
				cwd: 'dist',
				src: '**',
				dest: ''
			}
		},
		clean: {
			dist: {
				src: 'dist/**',
			},
			src: {
				src: 'src/*.build.*'
			},
			release: {
				src: ['*', '!dist/**', '!demo/**', '!resource/**','!bower_components/**', '!node_modules/**', 'Gruntfile.js', '!README.md', '!package.json', '!bower.json']
			},
			releaseDist: {
				src: ['dist']
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
				files: ['src/**','!src/*.build.*'],
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
	renameBuild: function () {
		grunt.file.recurse(path.resolve('./dist/'), this.onDistFile.bind(this));
	},
	onDistFile: function (abspath, rootdir, subdir, filename) {
		var path = abspath.replace('.build','');
		grunt.file.copy(abspath, path);
		grunt.file.delete(abspath);
	},
	onFile: function (abspath, rootdir, subdir, filename) {
		var name = grunt.option('name');
		if(filename.indexOf(this.COMPONENT_NAME) >=0)
		{
			var folderPath = abspath.substring(0,abspath.lastIndexOf('/'));
			var fileExtension = filename.substring(filename.indexOf('.'),filename.length);
			console.log('creating', folderPath + '/' + name + fileExtension);
			grunt.file.copy(abspath, folderPath + '/' + name + fileExtension);
			console.warn('deleting',abspath);
			grunt.file.delete(abspath);
		}
	},
	force: function(set)
  {
    if (set === "on")
    {
      grunt.option("force", true);
    }
    else if (set === "off")
    {
      grunt.option("force", false);
    }
    else if (set === "restore")
    {
      grunt.option("force", previous_force_state);
    }
  },
	replaceInGruntFile: function () {
      var content = grunt.file.read('Gruntfile.js');
      content = content.replace("COMPONENT_NAME: 'seed-component',","COMPONENT_NAME: '" +  grunt.option("name") + "',"); 
      grunt.file.write('Gruntfile.js',content);
	},
	register: function () {
		grunt.registerTask('renameFiles', this.renameFiles.bind(this));
		grunt.registerTask('renameBuild', this.renameBuild.bind(this));
		grunt.registerTask('force', this.force.bind(this));
		grunt.registerTask('replaceInGruntFile', this.replaceInGruntFile.bind(this));
		grunt.registerTask('rename', ['renameFiles','replace:name','replaceInGruntFile']);
		grunt.registerTask('serve', ['open','connect','watch']);
		grunt.registerTask('dist', ['shell:polybuild', 'clean:dist', 'copy:build', 'renameBuild','replace:distBuild','clean:src','copy:resource']);
		grunt.registerTask('develop', ['dist', 'serve']);
		grunt.registerTask('release', ['shell:getMergeWithMaster', 'force:on', 'shell:commitDevelopBranch', 'force:off',  'shell:switchToMaster', 'shell:pullMaster', 'shell:gitMerge', 'dist', 'clean:release', 'copy:dist', 'clean:releaseDist', 'replace:release', 'replace:releaseBuild', 'shell:gitCommit', 'shell:gitPush']);
	}

};

module.exports = TaskRunner.init.bind(TaskRunner);