const fs = require('fs');
const path = require('path');

// Function to recursively find all .test.tsx files
function findTestFiles(dir, testFiles = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith('.') &&
      file !== 'node_modules'
    ) {
      findTestFiles(filePath, testFiles);
    } else if (file.endsWith('.test.tsx')) {
      testFiles.push(filePath);
    }
  });

  return testFiles;
}

// Function to update a single test file
function updateTestFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file still uses MemoryRouter
  if (!content.includes('MemoryRouter')) {
    return false; // Already updated
  }

  console.log(`Updating: ${filePath}`);

  // Update imports
  content = content.replace(
    /import\s+{\s*MemoryRouter(?:\s*,\s*Route(?:\s*,\s*Routes)?)?\s*}\s+from\s+['"]react-router-dom['"];?/g,
    "import { createMemoryRouter, RouterProvider } from 'react-router-dom';"
  );

  // Pattern 1: Simple MemoryRouter with no Routes/Route
  content = content.replace(
    /render\(\s*<MemoryRouter(?:\s+initialEntries=\{([^}]+)\})?>\s*([^<]+)<\/MemoryRouter>/g,
    (match, initialEntries, children) => {
      const entries = initialEntries || "['/']";
      return `const router = createMemoryRouter([\n    {\n      path: '/',\n      element: ${children.trim()}\n    }\n  ], {\n    initialEntries: ${entries}\n  });\n\n  render(<RouterProvider router={router} />)`;
    }
  );

  // Pattern 2: MemoryRouter with Routes and Route
  content = content.replace(
    /render\(\s*<MemoryRouter\s+initialEntries=\{([^}]+)\}>\s*<Routes>\s*<Route\s+path="([^"]+)"\s+element=\{([^}]+)\}\s*\/>\s*<\/Routes>\s*<\/MemoryRouter>/g,
    (match, initialEntries, routePath, element) => {
      return `const router = createMemoryRouter([\n    {\n      path: '${routePath}',\n      element: ${element}\n    }\n  ], {\n    initialEntries: [${initialEntries}]\n  });\n\n  render(<RouterProvider router={router} />)`;
    }
  );

  // Pattern 3: MemoryRouter with Routes and Route (no initialEntries)
  content = content.replace(
    /render\(\s*<MemoryRouter>\s*<Routes>\s*<Route\s+path="([^"]+)"\s+element=\{([^}]+)\}\s*\/>\s*<\/Routes>\s*<\/MemoryRouter>/g,
    (match, routePath, element) => {
      return `const router = createMemoryRouter([\n    {\n      path: '${routePath}',\n      element: ${element}\n    }\n  ], {\n    initialEntries: ['/']\n  });\n\n  render(<RouterProvider router={router} />)`;
    }
  );

  // Pattern 4: rerender with MemoryRouter
  content = content.replace(
    /rerender\(\s*<MemoryRouter(?:\s+initialEntries=\{([^}]+)\})?>\s*([^<]+)<\/MemoryRouter>/g,
    (match, initialEntries, children) => {
      const entries = initialEntries || "['/']";
      return `const newRouter = createMemoryRouter([\n    {\n      path: '/',\n      element: ${children.trim()}\n    }\n  ], {\n    initialEntries: ${entries}\n  });\n\n  rerender(<RouterProvider router={newRouter} />)`;
    }
  );

  // Pattern 5: rerender with MemoryRouter and Routes/Route
  content = content.replace(
    /rerender\(\s*<MemoryRouter\s+initialEntries=\{([^}]+)\}>\s*<Routes>\s*<Route\s+path="([^"]+)"\s+element=\{([^}]+)\}\s*\/>\s*<\/Routes>\s*<\/MemoryRouter>/g,
    (match, initialEntries, routePath, element) => {
      return `const newRouter = createMemoryRouter([\n    {\n      path: '${routePath}',\n      element: ${element}\n    }\n  ], {\n    initialEntries: [${initialEntries}]\n  });\n\n  rerender(<RouterProvider router={newRouter} />)`;
    }
  );

  // Pattern 6: setup function with MemoryRouter
  content = content.replace(
    /setup\(\s*<MemoryRouter(?:\s+initialEntries=\{([^}]+)\})?>\s*([^<]+)<\/MemoryRouter>/g,
    (match, initialEntries, children) => {
      const entries = initialEntries || "['/']";
      return `const router = createMemoryRouter([\n    {\n      path: '/',\n      element: ${children.trim()}\n    }\n  ], {\n    initialEntries: ${entries}\n  });\n\n  setup(<RouterProvider router={router} />)`;
    }
  );

  // Pattern 7: setup function with MemoryRouter and Routes/Route
  content = content.replace(
    /setup\(\s*<MemoryRouter\s+initialEntries=\{([^}]+)\}>\s*<Routes>\s*<Route\s+path="([^"]+)"\s+element=\{([^}]+)\}\s*\/>\s*<\/Routes>\s*<\/MemoryRouter>/g,
    (match, initialEntries, routePath, element) => {
      return `const router = createMemoryRouter([\n    {\n      path: '${routePath}',\n      element: ${element}\n    }\n  ], {\n    initialEntries: [${initialEntries}]\n  });\n\n  setup(<RouterProvider router={router} />)`;
    }
  );

  fs.writeFileSync(filePath, content);
  return true;
}

// Main execution
const testFiles = findTestFiles('./src');
let updatedCount = 0;

testFiles.forEach(filePath => {
  if (updateTestFile(filePath)) {
    updatedCount += 1;
  }
});

console.log(`\nUpdated ${updatedCount} test files to use createMemoryRouter`);
