#!/bin/bash

# Script to fix remaining form tags that weren't caught by the first script
# This script uses a more comprehensive approach to find and replace all form tags

echo "Fixing remaining form tags..."

# Function to update a single file
fix_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Fixing $file..."
    
    # Create a backup
    cp "$file" "$temp_file"
    
    # Use awk to process the file more carefully
    awk '
    BEGIN { in_formik = 0; form_count = 0; }
    
    /<Formik/ { in_formik = 1; }
    /<\/Formik>/ { in_formik = 0; }
    
    in_formik && /<form[^>]*>/ {
        form_count++;
        gsub(/<form/, "<MINTForm");
        print;
        next;
    }
    
    in_formik && /<\/form>/ {
        gsub(/<\/form>/, "</MINTForm>");
        print;
        next;
    }
    
    { print; }
    ' "$temp_file" > "$file"
    
    # Remove backup
    rm "$temp_file"
    
    echo "✓ Fixed $file"
}

# Find all TypeScript/TSX files that contain both Formik and form tags
find src -name "*.tsx" -o -name "*.ts" | while read -r file; do
    if grep -q "Formik" "$file" && grep -q "<form" "$file"; then
        fix_file "$file"
    fi
done

echo ""
echo "Form tag fixes completed!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run lint:fix' to fix any formatting issues"
echo "2. Run 'npm run build:ts' to check for TypeScript errors"
echo "3. Test the application to ensure forms still work correctly"
