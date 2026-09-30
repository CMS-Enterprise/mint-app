#!/usr/bin/env node
/* eslint-disable no-console */
// Prints the comma-separated Cypress spec list for one shard, for `cypress run --spec`.
//
// Usage: node scripts/cypress-shard.cjs <shard (1-based)> <total shards>
//
// Specs are balanced greedily by line count (a rough proxy for run time): the
// largest spec goes to the lightest shard. The split is deterministic, so every
// shard computes the same assignment independently.
const fs = require('node:fs');
const path = require('node:path');

const SPEC_DIR = 'cypress/e2e';
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

const specs = listSpecs(SPEC_DIR)
  .map(file => ({
    file,
    weight: fs.readFileSync(file, 'utf8').split('\n').length
  }))
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
