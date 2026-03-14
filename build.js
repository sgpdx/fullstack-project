// Minimal build step for Vercel deployments.
// This project renders pages at runtime via Express (app.js),
// so there is no static compilation step required.

console.log("build.js: no compile step required for this project.");
console.log("build.js: keeping runtime workflow unchanged (npx nodemon app.js).");

process.exit(0);
