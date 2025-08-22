#!/usr/bin/env python3
"""
Script to fix all remaining form tags in Formik components to use MINTForm.
This script will systematically update the codebase to use the new MINTForm component.
"""

import os
import re
import glob
from pathlib import Path

def fix_file(file_path):
    """Fix a single file by replacing form tags with MINTForm."""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file contains both Formik and form tags
    if '<Formik' not in content or '<form' not in content:
        print(f"  Skipping {file_path} - no Formik or form tags found")
        return False
    
    # Add MINTForm import if not already present
    if "import MINTForm from 'components/MINTForm'" not in content:
        # Find the line with Formik import and add MINTForm import after it
        formik_import_pattern = r'(import.*Formik.*from.*formik.*\n)'
        match = re.search(formik_import_pattern, content, re.IGNORECASE)
        if match:
            content = content.replace(
                match.group(1),
                match.group(1) + "import MINTForm from 'components/MINTForm';\n"
            )
        else:
            # If no Formik import found, add it before the first import
            first_import = re.search(r'^import.*\n', content, re.MULTILINE)
            if first_import:
                content = content.replace(
                    first_import.group(0),
                    first_import.group(0) + "import MINTForm from 'components/MINTForm';\n"
                )
    
    # Replace opening form tags with MINTForm
    content = re.sub(r'<form([^>]*)>', r'<MINTForm\1>', content)
    
    # Replace closing form tags with MINTForm
    content = re.sub(r'</form>', r'</MINTForm>', content)
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Fixed {file_path}")
    return True

def main():
    """Main function to process all TypeScript/TSX files."""
    print("Starting form tag updates to MINTForm...")
    
    # Find all TypeScript/TSX files
    tsx_files = glob.glob('src/**/*.tsx', recursive=True)
    ts_files = glob.glob('src/**/*.ts', recursive=True)
    all_files = tsx_files + ts_files
    
    fixed_count = 0
    
    for file_path in all_files:
        if fix_file(file_path):
            fixed_count += 1
    
    print(f"\nForm tag updates completed! Fixed {fixed_count} files.")
    print("\nNext steps:")
    print("1. Run 'npm run lint:fix' to fix any formatting issues")
    print("2. Run 'npm run build:ts' to check for TypeScript errors")
    print("3. Test the application to ensure forms still work correctly")
    print("\nNote: Some files may need manual review if they have complex form structures")

if __name__ == "__main__":
    main()
