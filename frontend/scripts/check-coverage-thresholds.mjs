import fs from "node:fs";
import path from "node:path";

const coverageFile = path.resolve(
  "coverage",
  "app-frontend",
  "coverage-final.json",
);

const thresholds = {
  global: { statements: 70, branches: 70, functions: 60, lines: 75 },
  "src/app/core": { statements: 82, branches: 78, functions: 69, lines: 82 },
  "src/app/services": {
    statements: 69,
    branches: 76,
    functions: 66,
    lines: 69,
  },
  "src/app/customers": {
    statements: 76,
    branches: 65,
    functions: 66,
    lines: 78,
  },
  "src/app/orders": { statements: 71, branches: 63, functions: 61, lines: 71 },
};

function isCountableFile(filePath) {
  return (
    /\/src\/app\//.test(filePath.replace(/\\/g, "/")) &&
    filePath.endsWith(".ts")
  );
}

function fileMetrics(entry) {
  const statementsTotal = Object.keys(entry.s ?? {}).length;
  const statementsCovered = Object.values(entry.s ?? {}).filter(
    (v) => v > 0,
  ).length;

  const functionsTotal = Object.keys(entry.f ?? {}).length;
  const functionsCovered = Object.values(entry.f ?? {}).filter(
    (v) => v > 0,
  ).length;

  const branchTotals = Object.values(entry.b ?? {}).flat();
  const branchesTotal = branchTotals.length;
  const branchesCovered = branchTotals.filter((v) => v > 0).length;

  return {
    statementsCovered,
    statementsTotal,
    functionsCovered,
    functionsTotal,
    branchesCovered,
    branchesTotal,
    linesCovered: statementsCovered,
    linesTotal: statementsTotal,
  };
}

function sumMetrics(metricsList) {
  return metricsList.reduce(
    (acc, curr) => ({
      statementsCovered: acc.statementsCovered + curr.statementsCovered,
      statementsTotal: acc.statementsTotal + curr.statementsTotal,
      functionsCovered: acc.functionsCovered + curr.functionsCovered,
      functionsTotal: acc.functionsTotal + curr.functionsTotal,
      branchesCovered: acc.branchesCovered + curr.branchesCovered,
      branchesTotal: acc.branchesTotal + curr.branchesTotal,
      linesCovered: acc.linesCovered + curr.linesCovered,
      linesTotal: acc.linesTotal + curr.linesTotal,
    }),
    {
      statementsCovered: 0,
      statementsTotal: 0,
      functionsCovered: 0,
      functionsTotal: 0,
      branchesCovered: 0,
      branchesTotal: 0,
      linesCovered: 0,
      linesTotal: 0,
    },
  );
}

function toPct(covered, total) {
  if (!total) return 100;
  return Number(((covered / total) * 100).toFixed(2));
}

function evaluateScope(scopeName, metrics, scopeThresholds) {
  const result = {
    statements: toPct(metrics.statementsCovered, metrics.statementsTotal),
    branches: toPct(metrics.branchesCovered, metrics.branchesTotal),
    functions: toPct(metrics.functionsCovered, metrics.functionsTotal),
    lines: toPct(metrics.linesCovered, metrics.linesTotal),
  };

  const failures = [];
  for (const [key, min] of Object.entries(scopeThresholds)) {
    if (result[key] < min) {
      failures.push(`${scopeName} -> ${key}: ${result[key]}% < ${min}%`);
    }
  }

  return { result, failures };
}

if (!fs.existsSync(coverageFile)) {
  console.error(`Coverage file not found: ${coverageFile}`);
  process.exit(1);
}

const rawCoverage = JSON.parse(fs.readFileSync(coverageFile, "utf-8"));
const entries = Object.entries(rawCoverage)
  .map(([filePath, entry]) => ({
    filePath: filePath.replace(/\\/g, "/"),
    entry,
  }))
  .filter(({ filePath }) => isCountableFile(filePath));

if (!entries.length) {
  console.error("No countable TS files found in coverage report.");
  process.exit(1);
}

const globalMetrics = sumMetrics(
  entries.map(({ entry }) => fileMetrics(entry)),
);
const globalEvaluation = evaluateScope(
  "global",
  globalMetrics,
  thresholds.global,
);

const allFailures = [...globalEvaluation.failures];

for (const [scope, scopeThresholds] of Object.entries(thresholds)) {
  if (scope === "global") continue;

  const scopedEntries = entries
    .filter(({ filePath }) => filePath.includes(`/${scope}/`))
    .map(({ entry }) => fileMetrics(entry));

  if (!scopedEntries.length) {
    allFailures.push(`${scope} -> no TS files found for threshold validation`);
    continue;
  }

  const scopedMetrics = sumMetrics(scopedEntries);
  const scopeEvaluation = evaluateScope(scope, scopedMetrics, scopeThresholds);
  console.log(
    `${scope} coverage -> statements: ${scopeEvaluation.result.statements}% | branches: ${scopeEvaluation.result.branches}% | functions: ${scopeEvaluation.result.functions}% | lines: ${scopeEvaluation.result.lines}%`,
  );
  allFailures.push(...scopeEvaluation.failures);
}

console.log("Coverage threshold check completed.");
console.log(
  `Global coverage -> statements: ${globalEvaluation.result.statements}% | branches: ${globalEvaluation.result.branches}% | functions: ${globalEvaluation.result.functions}% | lines: ${globalEvaluation.result.lines}%`,
);

if (allFailures.length) {
  console.error("Coverage thresholds failed:");
  for (const failure of allFailures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("All coverage thresholds passed.");
