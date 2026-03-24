/**
  * Author: LC5741501
  * Created Date: 13/03/26
  * Class path "dbs_test_playwright\extract-alltests.js"
  * This specification extracts all Playwright test scripts located under the e2e folder 
  * and generates both CSV and JSON output files containing the test descriptions. 
  * These files are automatically saved to the user's Downloads directory.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const folderPath = "./tests/e2e";

// Auto-detect Downloads folder
const downloadsFolder = path.join(os.homedir(), "Downloads");

const results = [];

// Recursively scan folders
function scanFolder(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanFolder(fullPath);
      continue;
    }

    if (file.endsWith(".spec.ts")) {
      extractTestsFromFile(fullPath);
    }
  }
}

// Extract test names with FIXED regex
function extractTestsFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // FIXED: Capturing group for test description
  const testRegex = /test(?:\.only|\.skip)?\(\s*['"`](.*?)['"`]/g;

  let match;
  while ((match = testRegex.exec(content)) !== null) {
    results.push({
      file: path.basename(filePath),
      test: match[1]   // <-- NOW NEVER undefined
    });
  }
}

// Export CSV
function exportToCSV(data, outputFile) {
  const header = "File,Test Description\n";

  const rows = data
    .map(r => `"${r.file}","${r.test.replace(/"/g, '""')}"`)
    .join("\n");

  fs.writeFileSync(outputFile, header + rows);
  console.log(`✅ CSV saved: ${outputFile}`);
}

// Run extraction
scanFolder(folderPath);

// Save JSON to Downloads
const jsonPath = path.join(downloadsFolder, "extract-alltests.json");
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
console.log(`✅ JSON saved: ${jsonPath}`);

// Save CSV to Downloads
const csvPath = path.join(downloadsFolder, "extract-alltests.csv");
exportToCSV(results, csvPath);
