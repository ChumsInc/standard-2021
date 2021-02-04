process.env.debug = '*';
/*
Impulse by Archetype Themes (https://archetypethemes.co)
    * vendor-scripts-v2.js

Updated by Steve Montgomery, Chums Inc. for latest modules and security fixes

Modifications:
    slick-carousel 1.8.1
        slick-carousel/slick/slick.js => slick-carousel.js
            * modified for changes to button roles, etc.
            * after updates compare files for any changes.

    photoswipe 4.1.3
        photoswipe/dist/photoswipe-ui.default.js
            * vendor-scripts-v2.js says
*/

const args = process.argv.slice(2).map(str => str.toLowerCase());
let production = false;

if (args.includes('-p') || args.includes('--production')) {
   production = true;
}
const debug = require('debug')('chums:build');
const path = require('path');
const fsp = require('fs').promises;
const {version} = require('./package.json');
const outputFile = `vendor-scripts-chums.${version}` + (production ? '.min.js' : '.js');
const uglify = require('uglify-js');

const outputPath = path.resolve(__dirname, './assets', outputFile);

const files = [
    // 'chums-custom-js/object.assign-polyfill.js',
    // 'node_modules/promise-polyfill/dist/polyfill.js',
    // 'node_modules/jquery/dist/jquery.js',
    // 'chums-custom-js/theme-jquery.js',
    'node_modules/enquire.js/dist/enquire.js',
    'chums-custom-js/slick-carousel.js',
    'node_modules/lazysizes/lazysizes.js',
    'node_modules/lazysizes/plugins/respimg/ls.respimg.js',
    'node_modules/lazysizes/plugins/rias/ls.rias.min.js',
    'node_modules/lazysizes/plugins/bgset/ls.bgset.js',
    'node_modules/lazysizes/plugins/object-fit/ls.object-fit.js',
    'node_modules/lazysizes/plugins/parent-fit/ls.parent-fit.js',
    'node_modules/handlebars/dist/handlebars.js',
    'chums-custom-js/preparetransition.js',
    // 'chums-custom-js/jquery.ba-throttle-debounce.js',
    'node_modules/aos/dist/aos.js',
    'node_modules/instafeed.js/instafeed.js',
    'node_modules/js-cookie/src/js.cookie.js',
    'chums-custom-js/photoswipe-archetype.js',
    'chums-custom-js/photoswipe-ui-archetype.js',
    'node_modules/zooming/build/zooming.js',
];

async function getFile(file) {
   const content = await fsp.readFile(path.resolve(__dirname, file), 'utf8');
   if (!production) {
      debug(`${file} > success`);
      return  `\n/* -- ${file} -- */\n${content}`;
   }
   const {code, error} = uglify.minify(content, {output: {preamble: `/* -- ${file} -- */`}});
   if (error) {
      debug(file, error);
      return error;
   }
   debug(`${file} > success`);
   return code || '';
}

async function build() {
    const js = await Promise.all(files.map(getFile));
    const header = `
/* 
   CHUMS rebuild of Impulse Theme vendor file
   version: ${version}; 
   date: ${new Date().toLocaleString()}
*/ 
    `;
    const output = [header, ...js].join('\n\n');
    await fsp.writeFile(outputPath, output);
    return true;
}

(function exec() {
   build()
       .then(success => console.log(`Finished ${outputPath} :: ${JSON.stringify(success)}`))
       .catch(error => console.error(error.message));
}());

// require('object-assign/index.js');
// require('promise-polyfill/dist/polyfill.js');
//
// require('jquery/dist/jquery.js');
// require('enquire.js/dist/enquire.js');
// require('./chums-custom-js/slick-carousel');
// require('handlebars/dist/handlebars.js');
// require('prepare-transition/preparetransition.js');
// require('instafeed.js/instafeed.js');
// require('js-cookie/src/js.cookie.js');
// require('aos/dist/aos.js');
// require('photoswipe/dist/photoswipe.js');
// require('photoswipe/dist/photoswipe-ui-default.js');
//
// require('lazysizes/lazysizes.js');
// require('lazysizes/plugins/respimg/ls.respimg.js');
// require('lazysizes/plugins/rias/ls.rias.min');
// require('lazysizes/plugins/bgset/ls.bgset.min');
// require('lazysizes/plugins/object-fit/ls.object-fit.min');
// require('lazysizes/plugins/parent-fit/ls.parent-fit.min');
// require('zooming/build/zooming.js')

