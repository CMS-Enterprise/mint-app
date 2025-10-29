#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Parse arguments
# Usage: check_migration_versions.sh [EVENT_TYPE] [BASE_BRANCH]
# EVENT_TYPE: pull_request, push, merge_group, or empty for local/pre-commit
# BASE_BRANCH: base branch name (only used for pull_request)
EVENT_TYPE="${1:-local}"
BASE_BRANCH="${2:-main}"

echo "🔍 Validating migration version numbers..."

# Get the migrations directory
MIGRATIONS_DIR="migrations"

# Get all migration files (committed + staged)
ALL_MIGRATIONS=$(find "$MIGRATIONS_DIR" -name "V*__*.sql" -type f 2>/dev/null | sort -V)

if [ -z "$ALL_MIGRATIONS" ]; then
    echo -e "${GREEN}✓ No migrations found${NC}"
    exit 0
fi

# Check for duplicate version numbers
echo "Checking for duplicate version numbers..."
versions_list=$(echo "$ALL_MIGRATIONS" | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename =~ ^V([0-9]+)__ ]]; then
        echo "${BASH_REMATCH[1]}:$file"
    fi
done | sort -t: -k1 -n)

# Check for duplicates
duplicates_found=false
prev_version=""
prev_file=""

while IFS=: read -r version file; do
    if [ "$version" = "$prev_version" ]; then
        if [ "$duplicates_found" = false ]; then
            echo -e "${RED}❌ ERROR: Duplicate migration versions found!${NC}"
            duplicates_found=true
        fi
        echo -e "   Version V${version}:"
        echo -e "     • $prev_file"
        echo -e "     • $file"
    fi
    prev_version="$version"
    prev_file="$file"
done <<< "$versions_list"

if [ "$duplicates_found" = true ]; then
    echo -e "${RED}❌ Migration validation failed: Duplicate version numbers found${NC}"
    if [ "$EVENT_TYPE" = "pull_request" ] || [ "$EVENT_TYPE" = "merge_group" ]; then
        echo -e "${YELLOW}💡 This usually happens when two PRs add migrations with the same version number.${NC}"
        echo -e "${YELLOW}   Please renumber your migration to use the next available version.${NC}"
    fi
    exit 1
fi

echo -e "${GREEN}✓ No duplicate migration versions found${NC}"

# If this is a push to main/master, we're done (only check duplicates)
if [ "$EVENT_TYPE" = "push" ]; then
    echo -e "${GREEN}✅ All migration validations passed!${NC}"
    exit 0
fi

# For PRs and merge_group, check consecutive versions
# For local/pre-commit, check staged files

if [ "$EVENT_TYPE" = "pull_request" ] || [ "$EVENT_TYPE" = "merge_group" ]; then
    # Get migrations that were added in this PR (compare against base branch)
    NEW_MIGRATIONS=$(git diff --name-only --diff-filter=A origin/"$BASE_BRANCH"...HEAD 2>/dev/null | grep "^${MIGRATIONS_DIR}/V[0-9]\+__.*\.sql$" || true)
    
    if [ -z "$NEW_MIGRATIONS" ]; then
        echo -e "${GREEN}✅ No new migrations added in this PR${NC}"
        exit 0
    fi
    
    echo ""
    echo "📋 New migrations in this PR:"
    while IFS= read -r line; do
        echo "   • $line"
    done <<< "$NEW_MIGRATIONS"
    
    # Get the highest version in base branch
    BASE_MIGRATIONS=$(git ls-tree -r --name-only origin/"$BASE_BRANCH" "$MIGRATIONS_DIR" 2>/dev/null | grep "^${MIGRATIONS_DIR}/V[0-9]\+__.*\.sql$" || true)
    
    max_version=0
    if [ -n "$BASE_MIGRATIONS" ]; then
        while IFS= read -r file; do
            filename=$(basename "$file")
            if [[ $filename =~ ^V([0-9]+)__ ]]; then
                version="${BASH_REMATCH[1]}"
                version_num=$((10#$version))
                if [ "$version_num" -gt "$max_version" ]; then
                    max_version=$version_num
                fi
            fi
        done <<< "$BASE_MIGRATIONS"
    fi
    
    echo ""
    echo "📊 Highest migration version in $BASE_BRANCH: V${max_version}"
    
    # Validate each new migration
    staged_versions=$(echo "$NEW_MIGRATIONS" | while read -r file; do
        filename=$(basename "$file")
        if [[ $filename =~ ^V([0-9]+)__ ]]; then
            echo "$((10#${BASH_REMATCH[1]})):$file"
        fi
    done | sort -t: -k1 -n)
    
    expected_version=$((max_version + 1))
    consecutive_error=false
    
    echo ""
    echo "Checking if new migrations are consecutive..."
    while IFS=: read -r version_num file; do
        if [ "$version_num" -ne "$expected_version" ]; then
            echo -e "${RED}❌ ERROR: Migration version V${version_num} is not consecutive!${NC}"
            echo -e "   Expected: V${expected_version}"
            echo -e "   Got: V${version_num}"
            echo -e "   File: $file"
            consecutive_error=true
        else
            echo -e "${GREEN}✓ V${version_num} is consecutive${NC}"
        fi
        expected_version=$((version_num + 1))
    done <<< "$staged_versions"
    
    if [ "$consecutive_error" = true ]; then
        echo ""
        echo -e "${RED}❌ Migration validation failed: Non-consecutive version numbers${NC}"
        echo -e "${YELLOW}💡 Tip: Rebase your branch on $BASE_BRANCH and renumber your migration to V$((max_version + 1))${NC}"
        exit 1
    fi
else
    # Local/pre-commit mode: check staged files
    STAGED_MIGRATIONS=$(git diff --cached --name-only --diff-filter=A 2>/dev/null | grep "^${MIGRATIONS_DIR}/V[0-9]\+__.*\.sql$" || true)
    
    if [ -z "$STAGED_MIGRATIONS" ]; then
        echo -e "${GREEN}✓ No new migrations to validate${NC}"
        exit 0
    fi
    
    echo "📋 New migrations being added:"
    while IFS= read -r line; do
        echo "   • $line"
    done <<< "$STAGED_MIGRATIONS"
    
    # Get the highest existing version number (excluding staged files)
    EXISTING_MIGRATIONS=$(git ls-tree -r --name-only HEAD "$MIGRATIONS_DIR" 2>/dev/null | grep "^${MIGRATIONS_DIR}/V[0-9]\+__.*\.sql$" || true)
    
    if [ -z "$EXISTING_MIGRATIONS" ]; then
        # This is the first migration
        echo -e "${GREEN}✓ This appears to be the first migration${NC}"
        exit 0
    fi
    
    # Extract version numbers and find the max
    max_version=0
    while IFS= read -r file; do
        filename=$(basename "$file")
        if [[ $filename =~ ^V([0-9]+)__ ]]; then
            version="${BASH_REMATCH[1]}"
            # Remove leading zeros for comparison
            version_num=$((10#$version))
            if [ "$version_num" -gt "$max_version" ]; then
                max_version=$version_num
            fi
        fi
    done <<< "$EXISTING_MIGRATIONS"
    
    echo "📊 Current highest migration version: V${max_version}"
    
    # Collect all staged migration versions
    staged_versions=$(echo "$STAGED_MIGRATIONS" | while read -r file; do
        filename=$(basename "$file")
        if [[ $filename =~ ^V([0-9]+)__ ]]; then
            echo "$((10#${BASH_REMATCH[1]})):$file"
        fi
    done | sort -t: -k1 -n)
    
    # Validate each staged migration
    expected_version=$((max_version + 1))
    consecutive_error=false
    
    while IFS=: read -r version_num file; do
        if [ "$version_num" -ne "$expected_version" ]; then
            echo -e "${RED}❌ ERROR: Migration version V${version_num} is not consecutive!${NC}"
            echo -e "   Expected: V${expected_version}"
            echo -e "   Got: V${version_num}"
            echo -e "   File: $file"
            consecutive_error=true
        else
            echo -e "${GREEN}✓ V${version_num} is consecutive${NC}"
        fi
        expected_version=$((version_num + 1))
    done <<< "$staged_versions"
    
    if [ "$consecutive_error" = true ]; then
        echo ""
        echo -e "${RED}❌ Migration validation failed: Non-consecutive version numbers${NC}"
        echo -e "${YELLOW}ℹ️  Tip: Rename your migration file to use the next available version number${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ All migration validations passed!${NC}"
exit 0

