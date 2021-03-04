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
const outputFile = `polyfills.${version}` + (production ? '.min.js' : '.js');
const uglify = require('uglify-js');

const outputPath = path.resolve(__dirname, './dist', outputFile);

const arrayIncludes = require('polyfill-array-includes')

const files = [
    'chums-custom-js/object.assign-polyfill.js',
    'node_modules/promise-polyfill/dist/polyfill.js',
    'node_modules/polyfill-array-includes/index.js',
    'chums-custom-js/debounce.js',
    'chums-custom-js/element.js'
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
