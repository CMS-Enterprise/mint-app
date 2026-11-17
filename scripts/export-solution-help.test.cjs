const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const { fetchSolutions, makeRows, readFrontend, toCsv } = require('./export-solution-help.cjs');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && (char === ',' || char === '\r')) {
      row.push(cell);
      cell = '';
      if (char === '\r') {
        assert.equal(text[++i], '\n');
        rows.push(row);
        row = [];
      }
    } else {
      cell += char;
    }
  }
  assert.equal(quoted, false);
  return rows;
}

test('extracts real frontend metadata, nested content, component source and dynamic links', () => {
  const frontend = readFrontend();
  assert.equal(frontend.catalog.INNOVATION.name, '4innovation');
  assert.equal(frontend.catalog.INNOVATION.components.timeline.components[0].name, 'Innovation4TimeLine');
  assert.match(frontend.catalog.INNOVATION.components.timeline.components[0].module, /4Innovation/);
  assert.ok(frontend.translations.INNOVATION.about.components[0].items.length > 1);
  assert.ok(frontend.translations.INNOVATION.timeline.items.length > 1);
  assert.match(JSON.stringify(frontend.translations.ARS), /\$\{window\.location\.origin\}/);
});

test('joins all keys and preserves CSV special characters and nested JSON', () => {
  const frontend = {
    catalog: { A: { name: 'front', categories: ['DATA'], components: {} }, B: { name: 'only frontend' } },
    translations: { A: { about: { description: 'a "quote",\nand a newline' } }, C: { about: {} } },
    route: '/help'
  };
  const rows = makeRows([{ key: 'A', name: 'backend', type: 'OTHER', subjects: ['DATA'], filterView: null }, { key: 'D', name: 'only backend' }], frontend);
  assert.deepEqual(rows.map(row => row.key), ['A', 'B', 'C', 'D']);
  const csv = parseCsv(toCsv(rows));
  const first = Object.fromEntries(csv[0].map((name, i) => [name, csv[1][i]]));
  assert.equal(first.graphql_name, 'backend');
  assert.equal(first.frontend_name, 'front');
  assert.equal(JSON.parse(first.frontend_help).about.description, 'a "quote",\nand a newline');
  assert.equal(first.help_url, '/help?solution-key=A&section=about');
  assert.throws(() => makeRows([{ key: 'A' }, { key: 'A' }], frontend), /duplicate/);
});

test('reports GraphQL errors and rejects insecure remote URLs', async () => {
  await assert.rejects(
    fetchSolutions('http://localhost/query', '', async () => ({
      ok: false, status: 400, text: async () => JSON.stringify({ errors: [{ message: 'Unauthorized' }] })
    })),
    /Unauthorized/
  );
  await assert.rejects(fetchSolutions('http://example.com/query', 'Bearer token'), /HTTPS/);
  await assert.rejects(
    fetchSolutions('https://example.com/query', '', async () => ({
      ok: true, status: 200, text: async () => '{}'
    })),
    /missing data.mtoCommonSolutions/
  );
});

test('CLI queries GraphQL and emits an actual joined CSV without contacts', async t => {
  let request;
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      request = { authorization: req.headers.authorization, body: JSON.parse(body) };
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ data: { mtoCommonSolutions: [
        { key: 'INNOVATION', name: 'DB innovation', type: 'IT_SYSTEM', subjects: ['DATA'], filterView: null },
        { key: 'BACKEND_ONLY', name: 'DB only', type: 'OTHER', subjects: [], filterView: null }
      ] } }));
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const script = path.join(__dirname, 'export-solution-help.cjs');
  const child = spawn(process.execPath, [script, `http://127.0.0.1:${server.address().port}/query`], {
    env: { ...process.env, MINT_GRAPHQL_AUTH: 'Bearer test-token' }
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const code = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', resolve);
  });
  assert.equal(code, 0, stderr);
  assert.equal(request.authorization, 'Bearer test-token');
  assert.match(request.body.query, /mtoCommonSolutions/);
  assert.doesNotMatch(request.body.query, /contact|contractor|systemOwner/i);
  const csv = parseCsv(stdout);
  const entries = csv.slice(1).map(row => Object.fromEntries(csv[0].map((name, i) => [name, row[i]])));
  const innovation = entries.find(row => row.key === 'INNOVATION');
  assert.equal(innovation.graphql_name, 'DB innovation');
  assert.equal(innovation.frontend_name, '4innovation');
  assert.ok(JSON.parse(innovation.frontend_help).timeline.items.length > 1);
  assert.equal(entries.find(row => row.key === 'BACKEND_ONLY').in_frontend_catalog, 'false');
  assert.equal(entries.find(row => row.key === 'ACO_OS').in_graphql, 'false');
});
