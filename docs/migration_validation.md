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

## GitHub Actions Workflow

The CI validation runs automatically on:

- Every PR that adds/modifies migration files
- Every push to `main`/`master` branch

### Workflow File

**Location:** `.github/workflows/check_migrations.yml`

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
