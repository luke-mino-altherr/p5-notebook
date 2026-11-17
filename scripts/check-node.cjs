// Runs before every npm script. Written in old-style JavaScript on purpose so that
// even very old Node versions can run it and print a helpful message.
var major = Number(process.versions.node.split('.')[0]);

if (major < 20) {
  console.error(
    '\n  p5 notebook needs Node.js 20 or newer, but this is Node ' + process.versions.node + '.\n\n' +
    '  If you use nvm:   nvm install 20 && nvm use 20\n' +
    '  To make it stick: nvm alias default 20\n' +
    '  Otherwise, download Node from https://nodejs.org\n'
  );
  process.exit(1);
}
