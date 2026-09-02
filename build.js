// Wraps _body.html (the portable page source) into a standalone index.html.
// Run: node build.js
//
// SITE_URL is the domain the built page claims as its own via <link rel=canonical>
// and the og:/twitter: tags. It must match where the file is actually served, or
// crawlers will attribute the page to a domain that does not serve it.
// Override per deploy:  SITE_URL=https://unknownuserfrommars.github.io node build.js
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const SITE_URL = (process.env.SITE_URL || 'https://kevin-z.com').replace(/\/+$/, '');
const OG_IMAGE = SITE_URL + '/og.jpg';

const fragment = fs.readFileSync(path.join(dir, '_body.html'), 'utf8');
const contentMarker = '<!-- page-content -->';
const markerIndex = fragment.indexOf(contentMarker);

if (markerIndex === -1 || fragment.indexOf(contentMarker, markerIndex + 1) !== -1) {
  throw new Error(`_body.html must contain exactly one ${contentMarker} marker`);
}

// Everything above the marker (title, font links, early preference script,
// styles) belongs in the document head on the real site.
const artifactHead = fragment.slice(0, markerIndex).trim();
const body = fragment.slice(markerIndex + contentMarker.length).trimStart();

const DESCRIPTION =
  'Kevin Zhou (unknownuserfrommars) builds regressionmadesimple, quickrun, and the patch series for his RoboCup robot. Python, C++, and a bit of Java.';
const SHORT_DESCRIPTION =
  'Small, sharp tools: regressionmadesimple, quickrun, and RoboCup robot patches.';

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
  '<meta name="theme-color" content="#f5f0ea" media="(prefers-color-scheme: light)">',
  '<meta name="theme-color" content="#14100e" media="(prefers-color-scheme: dark)">',
  '<meta name="description" content="' + DESCRIPTION + '">',
  '<meta name="author" content="Kevin Zhou">',
  '<link rel="canonical" href="' + SITE_URL + '/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Kevin Zhou">',
  '<meta property="og:url" content="' + SITE_URL + '/">',
  '<meta property="og:title" content="Kevin Zhou - unknownuserfrommars">',
  '<meta property="og:description" content="' + SHORT_DESCRIPTION + '">',
  '<meta property="og:image" content="' + OG_IMAGE + '">',
  '<meta property="og:image:type" content="image/jpeg">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="Kevin Zhou - unknownuserfrommars - small, sharp tools">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<meta name="twitter:creator" content="@_Kev1511">',
  '<meta name="twitter:title" content="Kevin Zhou - unknownuserfrommars">',
  '<meta name="twitter:description" content="' + SHORT_DESCRIPTION + '">',
  '<meta name="twitter:image" content="' + OG_IMAGE + '">',
  '<link rel="icon" href="' + favicon + '">',
  '<style>*{box-sizing:border-box}html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>',
  artifactHead,
  '</head>',
  '<body>',
].join('\n');

const out = head + '\n' + body + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('index.html written:', Buffer.byteLength(out), 'bytes  (canonical: ' + SITE_URL + ')');
