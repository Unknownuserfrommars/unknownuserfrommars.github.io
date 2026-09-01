// Wraps _body.html (the portable artifact source) into a standalone index.html.
// Run: node build.js
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const fragment = fs.readFileSync(path.join(dir, '_body.html'), 'utf8');
const contentMarker = '<!-- page-content -->';
const markerIndex = fragment.indexOf(contentMarker);

if (markerIndex === -1 || fragment.indexOf(contentMarker, markerIndex + 1) !== -1) {
  throw new Error(`_body.html must contain exactly one ${contentMarker} marker`);
}

// The artifact keeps its title, font links, early preference script and styles
// above the marker. Put those elements in the document head on the real site.
const artifactHead = fragment.slice(0, markerIndex).trim();
const body = fragment.slice(markerIndex + contentMarker.length).trimStart();

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
  '<meta name="description" content="Kevin Zhou (unknownuserfrommars) builds QuickRun, regressionmadesimple v4, and robotics patches; collaborator on FeOx, Cyrene-Agent, and Conflict.">',
  '<meta name="author" content="Kevin Zhou">',
  '<link rel="canonical" href="https://kevin-z.com/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:url" content="https://kevin-z.com/">',
  '<meta property="og:title" content="Kevin Zhou - unknownuserfrommars">',
  '<meta property="og:description" content="Small, sharp tools: QuickRun, regressionmadesimple v4, and robotics patches.">',
  '<meta property="og:image" content="https://kevin-z.com/og.png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="Kevin Zhou - unknownuserfrommars - small, sharp tools">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<meta name="twitter:creator" content="@_Kev1511">',
  '<meta name="twitter:title" content="Kevin Zhou - unknownuserfrommars">',
  '<meta name="twitter:description" content="Small, sharp tools: QuickRun, regressionmadesimple v4, and robotics patches.">',
  '<meta name="twitter:image" content="https://kevin-z.com/og.png">',
  '<link rel="icon" href="' + favicon + '">',
  '<style>*{box-sizing:border-box}html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>',
  artifactHead,
  '</head>',
  '<body>',
].join('\n');

const out = head + '\n' + body + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('index.html written:', Buffer.byteLength(out), 'bytes');
