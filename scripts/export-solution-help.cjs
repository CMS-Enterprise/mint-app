#!/usr/bin/env node

// Usage: MINT_GRAPHQL_AUTH='Bearer ...' node scripts/export-solution-help.cjs \
//   https://mint.example/graphql > solution-help.csv
// MINT_GRAPHQL_AUTH is optional and may also contain a Local authorization header.
// JSON cells preserve the English translation structure and markup. References to
// window.location.origin remain literal; component code is identified, not rendered.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const mapPath = 'src/features/HelpAndKnowledge/SolutionsHelp/solutionsMap.tsx';
const translationsPath = 'src/i18n/en-US/helpAndKnowledge/helpAndKnowledge.ts';
const query = `query ExportSolutionHelp {
  mtoCommonSolutions { key name type subjects filterView }
}`;

function sourceFile(relativePath) {
  const filename = path.join(root, relativePath);
  const source = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  if (source.parseDiagnostics.length) {
    throw new Error(
      `Could not parse ${relativePath}: ${source.parseDiagnostics[0].messageText}`
    );
  }
  return source;
}

function findVariable(source, name) {
  for (const statement of source.statements) {
    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(
        item => ts.isIdentifier(item.name) && item.name.text === name
      );
      if (declaration && declaration.initializer)
        return declaration.initializer;
    }
  }
  throw new Error(`Variable ${name} not found in ${source.fileName}`);
}

function readEnums(relativePath, names) {
  const source = sourceFile(relativePath);
  const enums = {};
  for (const statement of source.statements) {
    if (
      !ts.isEnumDeclaration(statement) ||
      !names.includes(statement.name.text)
    )
      continue;
    enums[statement.name.text] = Object.fromEntries(
      statement.members.map(member => {
        if (!member.initializer || !ts.isStringLiteral(member.initializer)) {
          throw new Error(
            `Expected string enum member in ${statement.name.text}`
          );
        }
        return [
          member.name.getText(source).replace(/^['"]|['"]$/g, ''),
          member.initializer.text
        ];
      })
    );
  }
  for (const name of names) {
    if (!enums[name])
      throw new Error(`Enum ${name} not found in ${relativePath}`);
  }
  return enums;
}

function evaluate(node, enums, source) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node) && node.text === 'undefined') return null;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
    return evaluate(node.expression, enums, source);
  }
  if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
    const values = enums[node.expression.text];
    if (values && Object.hasOwn(values, node.name.text))
      return values[node.name.text];
  }
  if (ts.isTemplateExpression(node)) {
    return (
      node.head.text +
      node.templateSpans
        .map(span => {
          if (span.expression.getText(source) !== 'window.location.origin') {
            throw new Error(
              `Unsupported template expression: ${span.expression.getText(source)}`
            );
          }
          return `\${window.location.origin}${span.literal.text}`;
        })
        .join('')
    );
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(element => evaluate(element, enums, source));
  }
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map(property => {
        if (!ts.isPropertyAssignment(property)) {
          throw new Error(
            `Unsupported object property: ${property.getText(source)}`
          );
        }
        const name = ts.isComputedPropertyName(property.name)
          ? evaluate(property.name.expression, enums, source)
          : property.name.text;
        if (name === undefined)
          throw new Error(
            `Unsupported property name: ${property.name.getText(source)}`
          );
        return [name, evaluate(property.initializer, enums, source)];
      })
    );
  }
  // React component factories cannot be represented as data. Keep their source
  // and referenced components so the relevant implementation can be located.
  if (ts.isArrowFunction(node)) {
    const components = new Set();
    function visit(child) {
      if (
        (ts.isJsxSelfClosingElement(child) || ts.isJsxOpeningElement(child)) &&
        ts.isIdentifier(child.tagName)
      )
        components.add(child.tagName.text);
      ts.forEachChild(child, visit);
    }
    visit(node);
    return { components: [...components], source: node.getText(source) };
  }
  const position = source.getLineAndCharacterOfPosition(node.getStart(source));
  throw new Error(
    `Unsupported expression at ${source.fileName}:${position.line + 1}: ${node.getText(source)}`
  );
}

function readFrontend() {
  const enums = {
    ...readEnums('src/gql/generated/graphql.ts', [
      'MtoCommonSolutionKey',
      'MtoCommonSolutionSubject',
      'MtoSolutionType'
    ]),
    ...readEnums('src/types/operationalSolutionCategories.ts', [
      'OperationalSolutionSubCategories'
    ])
  };
  const mapSource = sourceFile(mapPath);
  const translationsSource = sourceFile(translationsPath);
  const imports = new Map();
  for (const statement of mapSource.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.importClause?.name &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      imports.set(
        statement.importClause.name.text,
        statement.moduleSpecifier.text
      );
    }
  }
  const catalog = evaluate(
    findVariable(mapSource, 'helpSolutions'),
    enums,
    mapSource
  );
  for (const solution of Object.values(catalog)) {
    for (const component of Object.values(solution.components)) {
      component.components = component.components.map(name => {
        if (!imports.has(name))
          throw new Error(
            `Component ${name} has no default import in ${mapPath}`
          );
        return { name, module: imports.get(name) };
      });
    }
  }
  return {
    catalog,
    translations: evaluate(
      findVariable(translationsSource, 'solutions'),
      enums,
      translationsSource
    ),
    route: evaluate(
      findVariable(mapSource, 'solutionHelpRoute'),
      enums,
      mapSource
    )
  };
}

async function fetchSolutions(url, authorization, fetchImpl = fetch) {
  const endpoint = new URL(url);
  if (
    endpoint.protocol !== 'https:' &&
    !(
      endpoint.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname)
    )
  ) {
    throw new Error('GraphQL URL must use HTTPS, except for localhost');
  }
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    redirect: 'error',
    headers: {
      'content-type': 'application/json',
      ...(authorization ? { authorization } : {})
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok)
    throw new Error(`GraphQL request failed with HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(
      `GraphQL errors: ${result.errors.map(error => error.message).join('; ')}`
    );
  }
  if (!Array.isArray(result.data?.mtoCommonSolutions)) {
    throw new Error('GraphQL response is missing data.mtoCommonSolutions');
  }
  return result.data.mtoCommonSolutions;
}

function makeRows(backend, frontend) {
  const byKey = new Map();
  for (const solution of backend) {
    if (
      !solution ||
      typeof solution.key !== 'string' ||
      byKey.has(solution.key)
    ) {
      throw new Error(
        `Invalid or duplicate GraphQL solution key: ${solution?.key}`
      );
    }
    byKey.set(solution.key, solution);
  }
  const keys = [
    ...new Set([
      ...byKey.keys(),
      ...Object.keys(frontend.catalog),
      ...Object.keys(frontend.translations)
    ])
  ].sort();
  return keys.map(key => {
    const db = byKey.get(key);
    const catalog = frontend.catalog[key];
    const translation = frontend.translations[key];
    return {
      key,
      in_graphql: !!db,
      in_frontend_catalog: !!catalog,
      in_frontend_translations: !!translation,
      graphql_name: db?.name,
      graphql_type: db?.type,
      graphql_subjects: db?.subjects,
      graphql_filter_view: db?.filterView,
      frontend_name: catalog?.name,
      frontend_acronym: catalog?.acronym,
      frontend_type: catalog?.type,
      frontend_categories: catalog?.categories,
      frontend_subcategories: catalog?.subCategories,
      frontend_components: catalog?.components,
      frontend_help: translation,
      help_url: catalog
        ? `${frontend.route}?solution-key=${encodeURIComponent(key)}&section=about`
        : undefined
    };
  });
}

function toCsv(rows) {
  const columns = [
    'key',
    'in_graphql',
    'in_frontend_catalog',
    'in_frontend_translations',
    'graphql_name',
    'graphql_type',
    'graphql_subjects',
    'graphql_filter_view',
    'frontend_name',
    'frontend_acronym',
    'frontend_type',
    'frontend_categories',
    'frontend_subcategories',
    'frontend_components',
    'frontend_help',
    'help_url'
  ];
  const cell = value => {
    if (value === undefined || value === null) return '';
    const text =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };
  return `${[
    columns.join(','),
    ...rows.map(row => columns.map(column => cell(row[column])).join(','))
  ].join('\r\n')}\r\n`;
}

async function main() {
  const url = process.argv[2];
  if (!url || url === '--help' || process.argv.length !== 3) {
    console.error(
      'Usage: MINT_GRAPHQL_AUTH="Bearer <token>" node scripts/export-solution-help.cjs <graphql-url> > solution-help.csv'
    );
    console.error(
      'Use a Local authorization header for local auth. Structured frontend help and component references are JSON cells.'
    );
    process.exitCode = url === '--help' && process.argv.length === 3 ? 0 : 1;
    return;
  }
  const frontend = readFrontend();
  const backend = await fetchSolutions(url, process.env.MINT_GRAPHQL_AUTH);
  process.stdout.write(toCsv(makeRows(backend, frontend)));
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Export failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { fetchSolutions, makeRows, readFrontend, toCsv };
