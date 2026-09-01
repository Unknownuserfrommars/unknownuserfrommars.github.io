// Wraps _body.html (the portable page content) into a standalone index.html.
// Run: node build.js
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const body = fs.readFileSync(path.join(dir, '_body.html'), 'utf8');

const favicon =
  'data:image/svg+xml,' +
  '%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E' +
  '%3Crect width=%2232%22 height=%2232%22 rx=%226%22 fill=%22%231c1613%22/%3E' +
  '%3Ctext x=%2216%22 y=%2223%22 font-family=%22Georgia,serif%22 font-size=%2219%22 ' +
  'fill=%22%23e2703a%22 text-anchor=%22middle%22%3EFe%3C/text%3E%3C/svg%3E';

const head = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="color-scheme" content="light dark">',
  '<meta name="description" content="Kevin Z. (unknownuserfrommars) - building FeOx, a numerical language in Rust; regressionmadesimple on PyPI; Cyrene-Agent. Projects, stack and contact.">',
  '<meta name="author" content="Kevin Z.">',
  '<link rel="canonical" href="https://kevin-z.com/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:url" content="https://kevin-z.com/">',
  '<meta property="og:title" content="Kevin Z. - unknownuserfrommars">',
  '<meta property="og:description" content="Mars is red because of rust. Small, sharp tools: FeOx, regressionmadesimple, Cyrene-Agent.">',
  '<meta name="twitter:card" content="summary">',
  '<meta name="twitter:creator" content="@_Kev1511">',
  '<link rel="icon" href="' + favicon + '">',
  '<style>*{box-sizing:border-box}html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>',
  '</head>',
  '<body>',
].join('\n');

const out = head + '\n' + body + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('index.html written:', Buffer.byteLength(out), 'bytes');
