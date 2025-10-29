# Migration Version Validation

This project includes **two layers** of validation to prevent migration version conflicts:

1. **🔧 Local Pre-commit Hook** - Validates on your machine before commit
2. **☁️ GitHub Actions CI** - Validates on PRs before merge

## What It Checks

Both validations check for:

1. **No Duplicate Version Numbers** - Ensures no two migration files have the same version number
2. **Consecutive Versions** - Ensures new migrations follow sequentially from the last committed version

## Why Two Layers?

**Pre-commit hooks only run locally** - they cannot prevent issues when:
- Multiple developers create migrations with the same version number
- PRs are merged via GitHub's web interface
- Branches are merged without running local hooks

**GitHub Actions run on every PR** - they catch conflicts before merge:
- ✅ Validates all PRs before they can be merged
- ✅ Catches duplicate versions from parallel development
- ✅ Required status check prevents merging broken migrations

## How It Works

### Duplicate Detection

The script scans all migration files in the `migrations/` directory and checks for duplicate version numbers:

```bash
migrations/V222__System_Intake_Contacts_Set_Created_When_NULL.sql  ✅
migrations/V222__Another_Migration.sql                             ❌ Duplicate!
```

**Error Example:**
```
❌ ERROR: Duplicate migration versions found!
   Version V222:
     • migrations/V222__System_Intake_Contacts_Set_Created_When_NULL.sql
     • migrations/V222__Another_Migration.sql
```

### Consecutive Version Validation

When adding a new migration, the script ensures it follows consecutively from the highest committed version:

```bash
Current highest version: V222
Next migration must be:  V223  ✅
Trying to add:          V999  ❌ Not consecutive!
```

**Error Example:**
```
❌ ERROR: Migration version V999 is not consecutive!
   Expected: V223
   Got: V999
   File: migrations/V999__Test_Migration.sql

ℹ️  Tip: Rename your migration file to use the next available version number
```

## Usage

The validation runs automatically on every commit when you have pre-commit hooks installed.

### Installing Pre-commit Hooks

If you haven't already installed the pre-commit hooks:

```bash
# Install pre-commit (if not already installed)
brew install pre-commit  # macOS
# or
pip install pre-commit   # Python

# Install the git hooks
pre-commit install
```

### Manual Validation

You can also run the validation manually:

```bash
./scripts/check_migration_versions.sh
```

### Creating a New Migration

1. Check the current highest version:
   ```bash
   ls -1 migrations/ | grep "^V" | sort -V | tail -1
   ```

2. Create your new migration with the next version number:
   ```bash
   touch migrations/V223__Your_Migration_Description.sql
   ```

3. Commit as usual - the validation will run automatically

## Migration Naming Convention

All migrations must follow this format:

```
V{version}__{description}.sql
```

**Examples:**
- ✅ `V223__Add_User_Table.sql`
- ✅ `V224__Update_Permissions.sql`
- ❌ `v223__add_user_table.sql` (lowercase 'v')
- ❌ `V223_Add_User_Table.sql` (single underscore)
- ❌ `223__Add_User_Table.sql` (missing 'V')

## Bypassing the Validation (Not Recommended)

In rare cases where you need to bypass the validation (e.g., merging branches with conflicting migration numbers):

```bash
# Skip all pre-commit hooks
git commit --no-verify

# OR skip only the migration check
SKIP=check_migration_versions git commit
```

**⚠️ Warning:** Only bypass the validation if you understand the implications and have a plan to resolve version conflicts.

## Handling Merge Conflicts

When merging branches, you might encounter migration version conflicts:

### Scenario: Two branches both added V223

```
main:          V222 ─┬─ V223 (Branch A)
                     └─ V223 (Branch B) ← Conflict!
```

### Resolution:

1. After merging, you'll have duplicate V223 files
2. The pre-commit hook will catch this and fail
3. Rename one migration to V224:
   ```bash
   git mv migrations/V223__Branch_B_Feature.sql migrations/V224__Branch_B_Feature.sql
   ```
4. Commit the rename:
   ```bash
   git add migrations/V224__Branch_B_Feature.sql
   git commit -m "Resolve migration version conflict"
   ```

## GitHub Actions Workflow

The CI validation runs automatically on:
- Every PR that adds/modifies migration files
- Every push to `main`/`master` branch

### Workflow File

**Location:** `.github/workflows/validate_migrations.yml`

### What Happens on PRs

1. **PR Created/Updated** → Workflow runs automatically
2. **Validation Checks:**
   - ✅ No duplicate versions (across all migrations)
   - ✅ New migrations are consecutive from base branch
3. **Results:**
   - ✅ **Pass** → PR can be merged
   - ❌ **Fail** → PR blocked, bot comments with instructions

### Example Failure Scenario

```
Developer A: Creates PR with V223
Developer B: Creates PR with V223 (parallel work)

Developer A's PR merges ✅ → V223 now in main

Developer B's PR now has issues:
❌ CI Check: Duplicate migration version V223 found!
💡 Action Required: Rebase on main and rename to V224
```

### Making It a Required Check

To **prevent merging** PRs with migration issues, you need **TWO branch protection settings**:

#### Required Settings:

1. Go to **Settings** → **Branches** → **Branch Protection Rules**
2. Select your main branch
3. Enable **"Require status checks to pass before merging"**
   - Add **"Check Migration Version Numbers"** as a required check
4. Enable **"Require branches to be up to date before merging"** ⚠️ **CRITICAL!**
5. Save

#### ⚠️ Critical: Why You Need BOTH Settings

**Without "Require branches to be up to date":**
```
PR #1 (V223) → opens → CI passes ✅
PR #2 (V223) → opens → CI passes ✅
PR #2 merges → main now has V223
PR #1 merges → 💥 DUPLICATE! (CI still shows old green checkmark)
```

**With BOTH settings:**
```
PR #1 (V223) → opens → CI passes ✅
PR #2 (V223) → opens → CI passes ✅
PR #2 merges → main now has V223
PR #1 tries to merge:
  → 🔒 GitHub: "This branch is out-of-date"
  → Developer updates branch (rebase)
  → CI re-runs against NEW main
  → ❌ CI fails: Duplicate V223!
  → 🚫 Merge button disabled
```

The second setting **forces a rebase before merge**, which triggers CI to re-run with the latest main branch, catching any newly introduced conflicts.

## Script Location

- **Local Script:** `scripts/check_migration_versions.sh`
- **Pre-commit Config:** `.pre-commit-config.yaml`
- **GitHub Workflow:** `.github/workflows/validate_migrations.yml`
- **Migrations Directory:** `migrations/`

## Troubleshooting

### Issue: "No such file or directory"

Make sure the script is executable:
```bash
chmod +x scripts/check_migration_versions.sh
```

### Issue: Hook doesn't run

Reinstall pre-commit hooks:
```bash
pre-commit uninstall
pre-commit install
```

### Issue: False positive for consecutive check

The script only checks **newly staged** migrations. If you're modifying an existing migration, it won't flag it as non-consecutive.

### Issue: CI check fails but local pre-commit passes

This happens when:
1. You created V223 locally (passed pre-commit)
2. Another PR with V223 was merged while your PR was open
3. Now CI detects duplicate V223

**Solution:**
```bash
# Rebase on latest main
git fetch origin
git rebase origin/main

# Rename your migration to the next available version
git mv migrations/V223__Your_Feature.sql migrations/V224__Your_Feature.sql

# Commit the rename
git add migrations/V224__Your_Feature.sql
git commit -m "Renumber migration to V224"

# Push to update PR
git push --force-with-lease
```

### Issue: PR merged despite CI failure

The CI check is **not enforced by default**. To make it required:
1. Repository Settings → Branches → Branch Protection Rules
2. Enable "Require status checks to pass before merging"
3. Add "Check Migration Version Numbers" to required checks

### Issue: Two PRs with same version both passed CI and both merged

This is the **race condition** scenario. It happens when:
1. PR #1 opens with V223 → CI passes (checks against main with V222)
2. PR #2 opens with V223 → CI passes (checks against main with V222)
3. PR #2 merges first → main now has V223
4. PR #1 merges → **Uses stale CI check!** → Duplicate V223 in main

**Root cause:** CI doesn't automatically re-run when the base branch changes.

**Solution:** Enable **"Require branches to be up to date before merging"**
- This forces PR #1 to rebase before merging
- Rebasing triggers a fresh CI run
- Fresh CI run detects duplicate V223
- Merge is blocked

This setting is **CRITICAL** and must be enabled alongside requiring the status check.

## Related Documentation

- [Flyway Migrations](https://flywaydb.org/documentation/)
- [Pre-commit Framework](https://pre-commit.com/)
- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
