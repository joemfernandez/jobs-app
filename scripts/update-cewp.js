// scripts/update-cewp.js
// Replaces {{version}} in the CEWP template and outputs a ready-to-paste file.

const fs = require("fs");
const path = require("path");

// Load version from package.json
const pkg = require("../package.json");
const version = pkg.version;

// Paths
const templatePath = path.join(__dirname, "..", "deploy", "cewp-template.html");
const outputPath = path.join(__dirname, "..", "build", "JobBoard", "cewp.html");

// Ensure build folder exists
const buildDir = path.join(__dirname, "..", "build", "JobBoard");
if (!fs.existsSync(buildDir)) {
    console.error("Build folder missing. Run `npm run build` first.");
    process.exit(1);
}

// Load template
let template = fs.readFileSync(templatePath, "utf-8");

// Replace placeholders
template = template.replace(/{{version}}/g, version);

// Write output
fs.writeFileSync(outputPath, template);

console.log(`CEWP HTML generated at: build/JobBoard/cewp.html (version ${version})`);
