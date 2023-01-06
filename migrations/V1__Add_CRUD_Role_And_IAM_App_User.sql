DO
$do$
BEGIN
  CREATE ROLE crud;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'not creating role crud -- it already exists';
END
$do$;
CREATE SCHEMA IF NOT EXISTS audit;
REVOKE ALL ON SCHEMA audit FROM public;
REVOKE ALL ON SCHEMA audit FROM crud;
GRANT SELECT, TRIGGER ON ALL TABLES IN SCHEMA AUDIT TO crud;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT SELECT ON TABLES TO crud;
GRANT USAGE ON SCHEMA audit TO crud;

-- Modify existing tables and sequences.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO crud;
REVOKE ALL PRIVILEGES ON TABLE flyway_schema_history FROM crud;
GRANT USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO crud;

-- Modify future tables and sequences.
-- Do not include `FOR ROLE` in the following statements so that:
-- 1. when this runs in RDS, it will apply to the role running migrations.
-- 2. when this runs in Docker, it will apply to the `postgres` role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,
INSERT,
UPDATE,
DELETE ON TABLES TO crud;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE,
UPDATE ON SEQUENCES TO crud;

-- SELECT list in both of the EXISTS queries can stay empty
DO
$do$
BEGIN
  -- Create app_user_iam if it doesn't already exist
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE rolname = 'app_user_iam'
  ) THEN
    CREATE USER app_user_iam;
  END IF;

  GRANT crud TO app_user_iam;

  -- rds_iam role only exists in RDS, not locally
  IF EXISTS (
    SELECT 
    FROM   pg_catalog.pg_roles
    WHERE  rolname = 'rds_iam'
  ) THEN
    GRANT rds_iam TO app_user_iam;
  END IF;
END
$do$;
