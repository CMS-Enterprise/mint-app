#!/usr/bin/env node
/* eslint-disable no-console */
// Prints the comma-separated Cypress spec list for one shard, for `cypress run --spec`.
//
// Usage: node scripts/cypress-shard.cjs <shard (1-based)> <total shards>
//
// Specs are balanced greedily by expected duration: the longest spec goes to the
// lightest shard. The split is deterministic, so every shard computes the same
// assignment independently.
//
// Durations come from cypress/spec-timings.json ({ "<spec path>": seconds }).
// - A spec missing from the file (e.g. a new one) gets the average known duration.
// - If the file is missing or empty, specs are weighted by line count instead.
//
// To refresh the timings, copy the per-spec durations from a recent CI run's
// Cypress summary table into cypress/spec-timings.json.
const fs = require('node:fs');
const path = require('node:path');

const SPEC_DIR = 'cypress/e2e';
const TIMINGS_FILE = 'cypress/spec-timings.json';
const SPEC_EXT = /\.(js|jsx|ts|tsx)$/; // keep in sync with specPattern in cypress.config.ts

const shard = Number(process.argv[2]);
const total = Number(process.argv[3]);

if (
  !Number.isInteger(shard) ||
  !Number.isInteger(total) ||
  shard < 1 ||
  shard > total
) {
  console.error('Usage: cypress-shard.cjs <shard (1-based)> <total shards>');
  process.exit(1);
}

const listSpecs = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSpecs(full);
    return SPEC_EXT.test(entry.name) ? [full] : [];
  });

const loadTimings = () => {
  try {
    return JSON.parse(fs.readFileSync(TIMINGS_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
};

const files = listSpecs(SPEC_DIR);
const timings = loadTimings();
const known = files.map(file => timings[file]).filter(Number.isFinite);
const averageTiming = known.length
  ? known.reduce((sum, t) => sum + t, 0) / known.length
  : null;

const weightOf = file => {
  if (averageTiming === null) {
    // No timings available: line count is a rough proxy for run time
    return fs.readFileSync(file, 'utf8').split('\n').length;
  }
  return Number.isFinite(timings[file]) ? timings[file] : averageTiming;
};

const specs = files
  .map(file => ({ file, weight: weightOf(file) }))
  // Tie-break on name so the order is stable
  .sort((a, b) => b.weight - a.weight || a.file.localeCompare(b.file));

const bins = Array.from({ length: total }, () => ({ weight: 0, files: [] }));
specs.forEach(spec => {
  const lightest = bins.reduce((min, bin) =>
    bin.weight < min.weight ? bin : min
  );
  lightest.files.push(spec.file);
  lightest.weight += spec.weight;
});

console.log(bins[shard - 1].files.sort().join(','));
