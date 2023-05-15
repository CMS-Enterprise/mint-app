UPDATE model_plan_history SET
    status = 'CMS_CLEARANCE'
    -- modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    -- modified_dts = CURRENT_TIMESTAMP
WHERE status = 'HHS_CLEARANCE';
