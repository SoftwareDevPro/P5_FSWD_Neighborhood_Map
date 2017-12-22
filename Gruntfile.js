
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all_dist: ['dist/**']
    },
    copy: {
      templates: {
        files: [
          {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/'},
        ]
      }
    },
    htmlmin: {
      dev: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
            expand: true,
            cwd: 'dist',
            src: ['dist/**/*.html', '*.html'],
            dest: 'dist'
        }]
      }
    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        // only do our CSS (not 3rd-party)
        src: ['dist/css/style.css']
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['paper-dashboard.css'],
          dest: 'dist/css'
        },
        {
          expand: true,
          cwd: 'dist/css',
          src: ['styles.css'],
          dest: 'dist/css'
        },
        {
          expand: true,
          cwd: 'dist/css',
          src: ['themify-icons.css'],
          dest: 'dist/css'
        }
      ]
      }
    },
    jshint: {
      options: {
        moz: true,
      },
      all: ['dist/js/application.js']
    },
    uglify: {
      my_target: {
        files: {
          'dist/js/application.js': ['dist/js/application.js'],
          'dist/js/bootstrap-checkbox-radio.js': ['dist/js/bootstrap-checkbox-radio.js'],
          'dist/js/bootstrap-notify.js': ['dist/js/bootstrap-notify.js'],
          'dist/js/paper-dashboard.js': ['dist/js/paper-dashboard.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['clean','copy','htmlmin','csslint','cssmin','jshint','uglify'],
        options: {
          spawn: false,
        },
      },
    }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  default_tasks = ['clean',
                   'copy',
                   'htmlmin',
                   'csslint',
                   'cssmin',
                   'jshint',
                   'uglify'
                  ];

  grunt.registerTask('default', default_tasks);
};
