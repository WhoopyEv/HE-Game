const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const style = source.match(/<style>[\s\S]*?<\/style>/);
const body = source.match(/<body>([\s\S]*?)<\/body>/);

if (!style || !body) {
  console.error('No se pudo extraer <style> o <body> de index.html');
  process.exit(1);
}

const output = style[0] + '\n' + body[1].trim() + '\n';
fs.writeFileSync(path.join(root, 'artifact.html'), output);

console.log('artifact.html generado desde index.html (' + output.length + ' bytes)');
