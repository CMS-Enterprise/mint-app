#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

// Find all TypeScript files
const files = glob.sync('**/*.tsx', { ignore: ['node_modules/**'] });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Check if file uses useNavigate
  if (content.includes('useNavigate')) {
    console.log(`Processing: ${file}`);

    // Replace import
    if (content.includes("import { useNavigate } from 'react-router-dom'")) {
      content = content.replace(
        "import { useNavigate } from 'react-router-dom'",
        "import { useNavigate } from 'react-router-dom'"
      );
      modified = true;
    }

    // Replace hook usage
    if (content.includes('const navigate = useNavigate();')) {
      content = content.replace(
        'const navigate = useNavigate();',
        'const navigate = useNavigate();'
      );
      modified = true;
    }

    // Replace navigate calls
    content = content.replace(/history\.push\(/g, 'navigate(');

    // Replace history.replace calls
    content = content.replace(/history\.replace\(/g, 'navigate(');

    // Add { replace: true } to replace calls
    // This is a simple replacement - you may need to manually adjust some cases
    content = content.replace(/navigate\(([^)]+)\)/g, (match, args) => {
      if (args.includes('search:') && !args.includes('replace: true')) {
        return `navigate(${args}, { replace: true })`;
      }
      return match;
    });

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Updated: ${file}`);
    }
  }
});

console.log(
  'Conversion complete! Please review the changes and test your application.'
);
