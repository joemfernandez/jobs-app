// scripts/build.js
// Cleans and rebuilds the SharePoint-ready /build/JobBoard folder with versioned filenames

const fs = require("fs");
const path = require("path");

// Load version from package.json
const pkg = require("../package.json");
const version = pkg.version;

// Paths
const buildRoot = path.join(__dirname, "..", "build");
const jobBoardDir = path.join(buildRoot, "JobBoard");
const srcDir = path.join(__dirname, "..", "src");

// Files to copy into build/JobBoard/
const filesToCopy = [
    "core/jobs-core.js",
    "ui/jobs-ui.js",
    "sp/jobs-sp.js",
    "css/jobs.css",
    "data/jobs.txt"
];

// 1. Clean build directory
if (fs.existsSync(buildRoot)) {
    fs.rmSync(buildRoot, { recursive: true, force: true });
}

fs.mkdirSync(buildRoot);
fs.mkdirSync(jobBoardDir);

// 2. Copy required files with version stamping
filesToCopy.forEach((relativePath) => {
    const srcPath = path.join(srcDir, relativePath);
    const ext = path.extname(relativePath);
    const base = path.basename(relativePath, ext);

    const versionedName = `${base}.v${version}${ext}`;
    const destPath = path.join(jobBoardDir, versionedName);

    if (!fs.existsSync(srcPath)) {
        console.error(`Missing file: ${srcPath}`);
        process.exit(1);
    }

    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${relativePath} → ${versionedName}`);
});

console.log(`\nBuild complete. Files ready in /build/JobBoard (version ${version})`);
