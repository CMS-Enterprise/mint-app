UPDATE model_plan SET
    status = 'CMS_CLEARANCE',
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE status = 'HHS_CLEARANCE';


ALTER TYPE MODEL_PLAN_STATUS RENAME TO MODEL_PLAN_STATUS_OLD;

CREATE TYPE MODEL_PLAN_STATUS AS ENUM
(
    'PLAN_DRAFT',
    'PLAN_COMPLETE',
    'ICIP_COMPLETE',
    'INTERNAL_CMMI_CLEARANCE',
    'CMS_CLEARANCE',
    -- 'HHS_CLEARANCE', --This value has one seed data model
    'OMB_ASRF_CLEARANCE',
    'CLEARED',
    'ANNOUNCED',
    'PAUSED',
    'CANCELED'
)


ALTER TABLE model_plan ALTER COLUMN status TYPE MODEL_PLAN_STATUS USING status::TEXT::MODEL_PLAN_STATUS;

-- DROP TYPE MODEL_PLAN_STATUS_OLD; --Don't drop for testing, as history table might use old type
