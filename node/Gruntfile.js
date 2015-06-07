module.exports = function (grunt) {
  var path = require('path');
  grunt.initConfig({
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: 'bin/'
      }
    },
    clean: {
      build: {
        src: ["bin"]
      }
    },
    express: {
      options: {
        port: 3000
      },
      dev: {
        options: {
          script: 'app.js',
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      express: {
        files: ['**/*.*'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['express', 'watch']);
}      
