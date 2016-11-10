module.exports = function(grunt) {

  grunt.initConfig({
    webfont: {
      dtvfont: {
        src: 'fonts/icons/*.svg', // Location of individual font files to compile
        dest: 'fonts', // Destination for compiled fonts
        destCss: 'fonts', // Destination for compiled CSS
        options: {
          font: 'dtv2-icons', // Name of font and base name of font files.
          hashes: true, // Append font file names with unique string to flush browser cache when you update your icons.
          type: 'eot,woff', // Font files types to generate.
          order: 'eot,woff', // Order of @font-face’s src values in CSS file.
          // template: 'assets/fonts/template/dtv-icons-template.css',
          templateOptions: {
            // baseClass: 'glyph-icon',
            classPrefix: 'icon-dtv2-', // icon cleass prefix
            mixinPrefix: 'icon-dtv2-mixin-' // icon mixin prefix
          },

          stylesheet: 'less', // Output type
          relativeFontPath: '/_shared/ngtv2/fonts', // Relative path to fonts for LESS preprocessor
          htmlDemo: true, // Creates HTML sandbox for fonts
          // htmlDemoTemplate: '', // Custom template for sandbox
          destHtml: 'fonts' // Destination for HTML sandbox
        }
      }
    },
  });

  require('load-grunt-tasks')(grunt);
};