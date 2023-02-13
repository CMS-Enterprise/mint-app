import os
from git import Git, Repo

global_git = Git()
global_git.update_environment(
    **{k: os.environ[k] for k in os.environ if k.startswith('SSH')}
)

repo_path = "./"
migration_path = f"{repo_path}/migrations"

SQL_VARIANT_BASE_TASK_LIST = "base_task_list"
SQL_VARIANT_BASE_STRUCT = "base_struct"

migration_config = [
    # Base Task List
    # ('Plan_Ops_Eval_and_Learning', 'EASI-2612', SQL_VARIANT_BASE_TASK_LIST),
    ('Plan_Participants_and_Providers', 'EASI-2613', SQL_VARIANT_BASE_TASK_LIST),
    # ('Plan_Payments', 'EASI-2614', SQL_VARIANT_BASE_TASK_LIST),
    # ('Plan_Beneficiaries', 'EASI-2616', SQL_VARIANT_BASE_TASK_LIST),
    # ('Plan_General_Characteristics', 'EASI-2617', SQL_VARIANT_BASE_TASK_LIST),

    # Base Struct
    # ('plan_cr_tdl', 'EASI-2618', SQL_VARIANT_BASE_STRUCT),
    # ('plan_discussion', 'EASI-2619', SQL_VARIANT_BASE_STRUCT),
    # ('discussion_reply', 'EASI-2619', SQL_VARIANT_BASE_STRUCT),
    # ('plan_document', 'EASI-2620', SQL_VARIANT_BASE_STRUCT),
    # ('plan_document_solution_link', 'EASI-2621', SQL_VARIANT_BASE_STRUCT),
    # ('operational_need', 'EASI-2623', SQL_VARIANT_BASE_STRUCT),
    # ('operational_solution', 'EASI-2624', SQL_VARIANT_BASE_STRUCT),
    # ('analyzed_audit', '', SQL_VARIANT_BASE_STRUCT),
    # ('possible_operational_need', '', SQL_VARIANT_BASE_STRUCT),
    # ('possible_operational_solution', '', SQL_VARIANT_BASE_STRUCT),
    # ('possible_need_solution_link', '', SQL_VARIANT_BASE_STRUCT),

    # TODO: Something
    # ('existing_model', 'EASI-2622', SQL_VARIANT_BASE_STRUCT),

]

safe_mode = False
deploy_remote_branch = False


def generate_branch_name(table, ticket) -> str:
    return f"{ticket}/user_account_migration_{table.lower()}"


def create_git_branch(repo, branch_name):
    repo.git.checkout('main')
    repo.git.pull()
    repo.create_head(branch_name)

    if not safe_mode and deploy_remote_branch:
        repo.git.push('--set-upstream', repo.remote().name, branch_name)

    repo.git.checkout(branch_name)


def create_branch(repo, table, ticket):
    branch_name = generate_branch_name(table.lower(), ticket)
    print(f"Create a branch named {branch_name}")
    if not safe_mode:
        create_git_branch(repo, branch_name)

    if not safe_mode and deploy_remote_branch:
        repo.remote().push()


def generate_sql_migration_content(table, variant) -> str:
    if variant == SQL_VARIANT_BASE_TASK_LIST:
        return generate_sql_migration_content_base_task_list(table)
    if variant == SQL_VARIANT_BASE_STRUCT:
        return generate_sql_migration_content_base_struct(table)

    assert False and "No Valid Variant Found"


def generate_sql_migration_content_base_task_list(table) -> str:
    table = table.lower()
    return (f"/* ADD Temp data column for this */\n\n"
            f"ALTER TABLE {table}\n"
            f"RENAME COLUMN ready_for_clearance_by TO ready_for_clearance_by_old;\n\n"
            f"ALTER TABLE {table}\n"
            f"RENAME COLUMN ready_for_review_by TO ready_for_review_by_old;\n\n"
            f"ALTER TABLE {table}\n"
            f"RENAME COLUMN created_by TO created_by_old;\n\n\n"
            f"ALTER TABLE {table}\n"
            f"RENAME COLUMN modified_by TO modified_by_old;\n\n\n"
            f"/* ADD Correct Column */\n"
            f"ALTER TABLE {table}\n"
            f"ADD COLUMN ready_for_clearance_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,\n"
            f"ADD COLUMN ready_for_review_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,\n"
            f"ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,\n"
            f"ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;\n\n"
            f"ALTER TABLE {table}\n"
            f"DISABLE TRIGGER audit_trigger;\n\n"
            f"/* Perform the data migration */\n"
            f"WITH userAccount AS (\n"
            f"    SELECT\n"
            f"        {table}.id AS primaryID,\n"
            f"        user_account_ready_for_clearance.id AS ready_for_clearance_by,\n"
            f"        user_account_ready_for_review.id AS ready_for_review_by,\n"
            f"        user_account_created.id AS created_by,\n"
            f"        user_account_modified.id AS modified_by\n"
            f"    FROM {table}\n"
            f"    LEFT JOIN user_account AS user_account_ready_for_clearance ON {table}.ready_for_clearance_by_old = user_account_ready_for_clearance.username\n"
            f"    LEFT JOIN user_account AS user_account_ready_for_review ON {table}.ready_for_review_by_old = user_account_ready_for_review.username\n"
            f"    LEFT JOIN user_account AS user_account_created ON {table}.created_by_old = user_account_created.username\n"
            f"    LEFT JOIN user_account AS user_account_modified ON {table}.modified_by_old = user_account_modified.username\n"
            f")\n"
            f"--\n\n"
            f"UPDATE {table}\n"
            f"SET\n"
            f"    created_by = userAccount.created_by,\n"
            f"    modified_by = userAccount.modified_by,\n"
            f"    ready_for_clearance_by = userAccount.ready_for_clearance_by,\n"
            f"    ready_for_review_by = userAccount.ready_for_review_by\n"
            f"FROM userAccount\n"
            f"WHERE userAccount.primaryID = {table}.id;\n\n\n"
            f"/*remove the old columns */\n"
            f"ALTER TABLE {table}\n"
            f"DROP COLUMN ready_for_clearance_by_old,\n"
            f"DROP COLUMN ready_for_review_by_old,\n"
            f"DROP COLUMN created_by_old,\n"
            f"DROP COLUMN modified_by_old;\n\n"
            f"/*add constraints */\n"
            f"ALTER TABLE {table}\n"
            f"ALTER COLUMN created_by SET NOT NULL;\n\n\n"
            f"/* update audit config */\n"
            f"UPDATE audit.table_config\n"
            f"SET uses_user_id = TRUE,\n"
            f"    modified_by = '00000001-0001-0001-0001-000000000001', --System Account\n"
            f"    modified_dts = current_timestamp\n"
            f"WHERE name = '{table}';\n\n"
            f"/* turn on audit trigger */\n\n"
            f"ALTER TABLE {table}\n"
            f"ENABLE TRIGGER audit_trigger;\n"
            )


def generate_sql_migration_content_base_struct(table) -> str:
    table = table.lower()
    return (f"/* ADD Temp data column for this */\n"
            f"\n"
            f"ALTER TABLE model_plan\n"
            f"RENAME COLUMN created_by TO created_by_old;\n"
            f"\n"
            f"\n"
            f"ALTER TABLE model_plan\n"
            f"RENAME COLUMN modified_by TO modified_by_old;\n"
            f"\n"
            f"\n"
            f"/* ADD Correct Column */\n"
            f"ALTER TABLE model_plan\n"
            f"ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,\n"
            f"ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;\n"
            f"\n"
            f"ALTER TABLE model_plan\n"
            f"DISABLE TRIGGER audit_trigger;\n"
            f"\n"
            f"/* Perform the data migration */\n"
            f"WITH userAccount AS (\n"
            f"    SELECT\n"
            f"        model_plan.id AS primaryID,\n"
            f"        user_account_created.id AS created_by,\n"
            f"        user_account_modified.id AS modified_by\n"
            f"    FROM model_plan\n"
            f"    LEFT JOIN user_account AS user_account_created ON model_plan.created_by_old = user_account_created.username\n"
            f"    LEFT JOIN user_account AS user_account_modified ON model_plan.modified_by_old = user_account_modified.username\n"
            f")\n"
            f"--\n"
            f"\n"
            f"UPDATE model_plan\n"
            f"SET\n"
            f"    created_by = userAccount.created_by,\n"
            f"    modified_by = userAccount.modified_by\n"
            f"\n"
            f"FROM userAccount\n"
            f"WHERE userAccount.primaryID\n"
            f"      = model_plan.id;\n"
            f"\n"
            f"\n"
            f"/*remove the old columns */\n"
            f"ALTER TABLE model_plan\n"
            f"DROP COLUMN created_by_old,\n"
            f"DROP COLUMN modified_by_old;\n"
            f"\n"
            f"/*add constraints */\n"
            f"ALTER TABLE model_plan\n"
            f"ALTER COLUMN created_by SET NOT NULL;\n"
            f"\n"
            f"\n"
            f"/* update audit config */\n"
            f"UPDATE audit.table_config\n"
            f"SET uses_user_id = TRUE,\n"
            f"    modified_by = '00000001-0001-0001-0001-000000000001', --System Account\n"
            f"    modified_dts = current_timestamp\n"
            f"WHERE name = 'model_plan';\n"
            f"\n"
            f"/* turn on audit trigger */\n"
            f"\n"
            f"ALTER TABLE model_plan\n"
            f"ENABLE TRIGGER audit_trigger;\n"
            )


def write_sql_migration_file(filename, content):
    with open(f"{migration_path}/{filename}", "w") as migration_file:
        migration_file.write(content)


def generate_sql_migration_filename(migration_index, table) -> str:
    return f"V{migration_index}__Update_{table}_To_User_Account_Table.sql"


def generate_sql_migration(repo, table, migration_variant, migration_index):
    assert not repo.is_dirty()

    migration_filename = generate_sql_migration_filename(migration_index, table)
    print(f"Generate a SQL Migration: {migration_filename}")
    migration_sql = generate_sql_migration_content(table, migration_variant)
    if safe_mode:
        print(f"Migration SQL Contents: \n{migration_sql}")
    else:
        print(f"Writing Migration File...")
        write_sql_migration_file(migration_filename, migration_sql)

    repo.git.add(all=True)
    repo.git.commit("-am", f"feat: generated SQL for updating {table} to use the User Account table")


def generate_user_account_table_migration(repo, table, ticket, migration_variant, migration_index):
    create_branch(repo, table, ticket)
    generate_sql_migration(repo, table, migration_variant, migration_index)
    repo.git.checkout('main')


def main():
    repo = Repo(repo_path)
    assert not repo.bare

    root_migration_index = 59

    migration_index = root_migration_index
    for migration in migration_config:
        generate_user_account_table_migration(repo, migration[0], migration[1], migration[2], migration_index)
        migration_index = migration_index + 1


if __name__ == '__main__':
    main()
