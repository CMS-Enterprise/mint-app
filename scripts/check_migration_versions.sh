#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
# Usage: check_migration_versions.sh [EVENT_TYPE] [BASE_BRANCH] [--debug]
# EVENT_TYPE: pull_request, push, merge_group, or empty for local/pre-commit
# BASE_BRANCH: base branch name (only used for pull_request)
# --debug: enable debug mode
EVENT_TYPE="${1:-local}"
BASE_BRANCH="${2:-main}"
DEBUG=false

# Check for debug flag in any position
for arg in "$@"; do
    if [ "$arg" = "--debug" ]; then
        DEBUG=true
    fi
done

debug_log() {
    if [ "$DEBUG" = true ]; then
        echo -e "${BLUE}[debug] $1${NC}"
    fi
}

echo "🔍 Validating migration version numbers..."
debug_log "EVENT_TYPE=$EVENT_TYPE BASE_BRANCH=$BASE_BRANCH"

# Get the migrations directory
MIGRATIONS_DIR="migrations"

# Helper function to validate filename convention
# Commented out - not currently in use
# validate_filename() {
#     local file="$1"
#     local filename
#     filename=$(basename "$file")
#     # Check if filename matches the pattern V<number>__<description>.sql
#     if ! [[ $filename =~ ^V[0-9]+__[^/]+\.sql$ ]]; then
#         return 1
#     fi
#     return 0
# }

# Get all migration files (committed + staged)
ALL_MIGRATIONS=$(find "$MIGRATIONS_DIR" -name "V*__*.sql" -type f 2>/dev/null | sort -V)

if [ -z "$ALL_MIGRATIONS" ]; then
    echo -e "${GREEN}✓ No migrations found${NC}"
    exit 0
fi

debug_log "Found $(echo "$ALL_MIGRATIONS" | wc -l | tr -d ' ') total migration files"

# Check for duplicate version numbers
echo "Checking for duplicate version numbers..."
versions_list=$(echo "$ALL_MIGRATIONS" | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename =~ ^V([0-9]+)__ ]]; then
        echo "${BASH_REMATCH[1]}:$file"
    fi
done | sort -t: -k1 -n)

debug_log "Extracted versions from all migrations"

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
    # Get ALL files added in migrations directory (not just valid ones)
    # Include: A=Added, C=Copied, R=Renamed (in case files were duplicated)
    ALL_NEW_FILES=$(git diff --name-only --diff-filter=ACR origin/"$BASE_BRANCH"...HEAD 2>/dev/null | grep --color=never "^${MIGRATIONS_DIR}/" || true)
    
    debug_log "Found $(echo "$ALL_NEW_FILES" | grep -c '^' || echo 0) new files in migrations/ directory"
    
    if [ -z "$ALL_NEW_FILES" ]; then
        echo -e "${GREEN}✅ No new migrations added in this PR${NC}"
        exit 0
    fi
    
    # Check that all new files follow naming convention
    # echo ""
    # echo "Checking naming convention for new files..."
    # INVALID_NEW_FILES=""
    # while IFS= read -r file; do
    #     if [ -n "$file" ]; then
    #         if ! validate_filename "$file"; then
    #             INVALID_NEW_FILES="${INVALID_NEW_FILES}${file}\n"
    #         fi
    #     fi
    # done <<< "$ALL_NEW_FILES"
    # 
    # if [ -n "$INVALID_NEW_FILES" ]; then
    #     echo -e "${RED}❌ ERROR: Invalid migration filenames found!${NC}"
    #     echo -e "${RED}All migration files must follow the naming convention: V<number>__<description>.sql${NC}"
    #     echo -e "\nInvalid files:"
    #     echo -e "${INVALID_NEW_FILES}" | while IFS= read -r line; do
    #         if [ -n "$line" ]; then
    #             echo -e "   • $line"
    #         fi
    #     done
    #     echo -e "\n${YELLOW}💡 Example valid filename: V001__create_users_table.sql${NC}"
    #     exit 1
    # fi
    # 
    # echo -e "${GREEN}✓ All new files follow naming convention${NC}"
    
    # Now get only the valid migration files
    NEW_MIGRATIONS=$(echo "$ALL_NEW_FILES" | grep -E "^${MIGRATIONS_DIR}/V[0-9]+__.*\.sql$" || true)
    
    # Debug: Show what we found before filtering
    if [ -n "$ALL_NEW_FILES" ] && [ -z "$NEW_MIGRATIONS" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Warning: Found new files in migrations/ but none match the expected pattern${NC}"
        echo "Files found:"
        while IFS= read -r line; do
            if [ -n "$line" ]; then
                echo "   • $line"
            fi
        done <<< "$ALL_NEW_FILES"
        echo -e "${YELLOW}Expected pattern: ${MIGRATIONS_DIR}/V[0-9]+__*.sql${NC}"
    fi
    
    echo ""
    echo "📋 New migrations in this PR:"
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            echo "   • $line"
        fi
    done <<< "$NEW_MIGRATIONS"
    
    # Get the highest version in base branch
    BASE_MIGRATIONS=$(git ls-tree -r --name-only origin/"$BASE_BRANCH" "$MIGRATIONS_DIR" 2>/dev/null | grep -E "^${MIGRATIONS_DIR}/V[0-9]+__.*\.sql$" || true)
    
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
    
    if [ -z "$staged_versions" ]; then
        echo -e "${GREEN}✅ No new migrations to validate${NC}"
        exit 0
    fi
    
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
    debug_log "Running in local/pre-commit mode - checking staged files"
    
    # Get ALL staged files in migrations directory (not just valid ones)
    # Include: A=Added, C=Copied, R=Renamed (in case files were duplicated)
    # Note: --color=never on grep is CRITICAL to prevent ANSI color codes from breaking regex matching
    ALL_STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACR --no-color 2>/dev/null | grep --color=never "^${MIGRATIONS_DIR}/" || true)
    
    debug_log "Found $(echo "$ALL_STAGED_FILES" | grep -c '^' || echo 0) staged files in migrations/ directory"
    
    if [ "$DEBUG" = true ]; then
        echo ""
        echo -e "${BLUE}[debug] Raw git output (with od -c):${NC}"
        git diff --cached --name-only --diff-filter=ACR --no-color 2>/dev/null | grep --color=never "^${MIGRATIONS_DIR}/" | od -c | head -5
    fi
    
    if [ -z "$ALL_STAGED_FILES" ]; then
        echo -e "${GREEN}✓ No new migrations to validate${NC}"
        if [ "$DEBUG" = true ]; then
            echo -e "${YELLOW}💡 Tip: Make sure to stage your migration file with 'git add' before committing${NC}"
        fi
        exit 0
    fi
    
    # Check that all staged files follow naming convention
    # echo ""
    # echo "Checking naming convention for staged files..."
    # INVALID_STAGED_FILES=""
    # while IFS= read -r file; do
    #     if [ -n "$file" ]; then
    #         if ! validate_filename "$file"; then
    #             INVALID_STAGED_FILES="${INVALID_STAGED_FILES}${file}\n"
    #         fi
    #     fi
    # done <<< "$ALL_STAGED_FILES"
    # 
    # if [ -n "$INVALID_STAGED_FILES" ]; then
    #     echo -e "${RED}❌ ERROR: Invalid migration filenames found!${NC}"
    #     echo -e "${RED}All migration files must follow the naming convention: V<number>__<description>.sql${NC}"
    #     echo -e "\nInvalid files:"
    #     echo -e "${INVALID_STAGED_FILES}" | while IFS= read -r line; do
    #         if [ -n "$line" ]; then
    #             echo -e "   • $line"
    #         fi
    #     done
    #     echo -e "\n${YELLOW}💡 Example valid filename: V001__create_users_table.sql${NC}"
    #     exit 1
    # fi
    # 
    # echo -e "${GREEN}✓ All staged files follow naming convention${NC}"
    
    # Now get only the valid migration files
    STAGED_MIGRATIONS=$(echo "$ALL_STAGED_FILES" | grep -E "^${MIGRATIONS_DIR}/V[0-9]+__.*\.sql$" || true)
    
    if [ "$DEBUG" = true ]; then
        echo ""
        echo -e "${BLUE}[debug] ALL_STAGED_FILES content:${NC}"
        echo "$ALL_STAGED_FILES" | while IFS= read -r line; do
            if [ -n "$line" ]; then
                echo -e "${BLUE}  '$line'${NC}"
            fi
        done
        echo -e "${BLUE}[debug] Testing regex pattern: ^${MIGRATIONS_DIR}/V[0-9]+__.*\\.sql\$${NC}"
        echo -e "${BLUE}[debug] STAGED_MIGRATIONS after grep:${NC}"
        if [ -z "$STAGED_MIGRATIONS" ]; then
            echo -e "${BLUE}  (empty)${NC}"
        else
            echo "$STAGED_MIGRATIONS" | while IFS= read -r line; do
                if [ -n "$line" ]; then
                    echo -e "${BLUE}  '$line'${NC}"
                fi
            done
        fi
    fi
    
    # Debug: Show what we found before filtering
    if [ -n "$ALL_STAGED_FILES" ] && [ -z "$STAGED_MIGRATIONS" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Warning: Found staged files in migrations/ but none match the expected pattern${NC}"
        echo "Files found:"
        while IFS= read -r line; do
            if [ -n "$line" ]; then
                echo "   • $line"
            fi
        done <<< "$ALL_STAGED_FILES"
        echo -e "${YELLOW}Expected pattern: ${MIGRATIONS_DIR}/V[0-9]+__*.sql${NC}"
    fi
    
    if [ "$DEBUG" = true ]; then
        echo ""
        echo "📋 Staged migrations being added:"
        if [ -z "$STAGED_MIGRATIONS" ]; then
            echo "   (none)"
        else
            while IFS= read -r line; do
                if [ -n "$line" ]; then
                    echo "   • $line"
                fi
            done <<< "$STAGED_MIGRATIONS"
        fi
    fi
    
    # Get the highest existing version number (excluding staged files)
    EXISTING_MIGRATIONS=$(git ls-tree -r --name-only HEAD "$MIGRATIONS_DIR" 2>/dev/null | grep -E "^${MIGRATIONS_DIR}/V[0-9]+__.*\.sql$" || true)
    
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
    
    if [ -z "$staged_versions" ]; then
        echo -e "${GREEN}✓ No migrations to validate${NC}"
        exit 0
    fi
    
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

