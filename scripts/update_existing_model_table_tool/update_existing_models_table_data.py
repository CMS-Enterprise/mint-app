from migration_generator import MigrationGenerator
import pyperclip

file_path = "model_list.csv"
header_row_index = 0

# Load new data from csv and generate migration
migration_generator = MigrationGenerator(file_path, header_row_index)
migration = migration_generator.generate_migration()

# Copy migration to clipboard
pyperclip.copy(migration)

# Print generated migration
print(migration)
