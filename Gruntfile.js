module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        options: {
          banner:
            '/*' + "\n" +
            ' * <%= pkg.name %> - v<%= pkg.version %>' + "\n" +
            ' * <%= grunt.template.today("yyyy-mm-dd") %>' + "\n" +
            ' * License: MIT' + "\n" +
            ' */' + "\n"
        },
        files:{
          'dist/calendr.min.js': ['./index.js'],
          'dist/calendr.events.min.js': ['./lib/events.js']
        }
      }
    },
    jshint: {
      files: ['./index.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('build', ['jshint', 'uglify', 'mochaTest']);
};

