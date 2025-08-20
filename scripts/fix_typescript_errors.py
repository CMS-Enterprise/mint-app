#!/usr/bin/env python3
"""
Script to fix TypeScript errors related to implicit any types in onSubmit handlers.
"""

import re
import glob

def fix_file(file_path):
    """Fix TypeScript errors in a single file."""
    print(f"Fixing TypeScript errors in {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix onSubmit handlers with implicit any types
    # Pattern: onSubmit={e => { handleSubmit(e); }}
    # Replace with: onSubmit={(e: React.FormEvent<HTMLFormElement>) => { handleSubmit(e); }}
    
    # More specific pattern to avoid false positives
    pattern = r'onSubmit=\{e => \{\s*handleSubmit\(e\);\s*\}\}'
    replacement = 'onSubmit={(e: React.FormEvent<HTMLFormElement>) => {\n                          handleSubmit(e);\n                        }}'
    
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        print(f"  ✓ Fixed onSubmit handler in {file_path}")
        
        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Main function to process all TypeScript/TSX files with TypeScript errors."""
    print("Fixing TypeScript errors in onSubmit handlers...")
    
    # List of files that have TypeScript errors (from the build output)
    files_with_errors = [
        "src/features/ModelPlan/TaskList/Payment/BeneficiaryCostSharing/index.tsx",
        "src/features/ModelPlan/TaskList/Payment/ClaimsBasedPayment/index.tsx",
        "src/features/ModelPlan/TaskList/Payment/Complexity/index.tsx",
        "src/features/ModelPlan/TaskList/Payment/FundingSource/index.tsx",
        "src/features/ModelPlan/TaskList/Payment/NonClaimsBasedPayment/index.tsx",
        "src/features/ModelPlan/TaskList/Payment/Recover/index.tsx",
        "src/features/ModelPlan/TaskList/PrepareForClearance/Checklist/index.tsx",
        "src/features/ModelPlan/Timeline/index.tsx",
        "src/features/Notifications/Settings/index.tsx"
    ]
    
    fixed_count = 0
    
    for file_path in files_with_errors:
        if fix_file(file_path):
            fixed_count += 1
    
    print(f"\nTypeScript error fixes completed! Fixed {fixed_count} files.")
    print("\nNext steps:")
    print("1. Run 'npm run build:ts' to check if TypeScript errors are resolved")
    print("2. Test the application to ensure forms still work correctly")

if __name__ == "__main__":
    main()
