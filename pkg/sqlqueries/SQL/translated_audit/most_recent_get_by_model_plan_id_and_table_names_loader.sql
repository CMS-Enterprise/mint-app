WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT
    -- we use input_idx to keep track of the order of the input, and ensure we return the top result per input row
        ROW_NUMBER() OVER () AS input_idx,
        model_plan_id,
        is_admin,
        user_id,
        table_names,
        excluded_fields        
    FROM (
        SELECT DISTINCT -- This ensures that keys are deduplicated early on in the process
            model_plan_id,
            is_admin,
            user_id,
            table_names,
            excluded_fields
        FROM
            JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "is_admin" BOOLEAN, "user_id" UUID, "table_names" table_name[], "excluded_fields" TEXT[]) -- noqa
    ) deduped
),

KEYS_WITH_ACCESS_CHECK AS (
    SELECT
        qID.*,
        CASE
            WHEN pc.user_id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS is_collaborator,
        CASE
            WHEN qID.is_admin OR pc.user_id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS has_restricted_access,
        COALESCE(CARDINALITY(qID.table_names) > 0, FALSE) AS should_filter, -- are there tables to filter? if null, false, if less than 1, false
        COALESCE(CARDINALITY(qID.excluded_fields) > 0, FALSE) AS should_exclude_fields -- are there tables to filter? if null, false, if less than 1, false
    FROM
        QUERIED_IDS qID
    LEFT JOIN plan_collaborator pc
        ON qID.user_id = pc.user_id AND qID.model_plan_id = pc.model_plan_id
),

RANKED_AUDIT AS (
    SELECT 
        qID.input_idx,
        tAudit.id,
        qID.model_plan_id,
        tAudit.actor_id,
        actor.common_name AS actor_name,
        tAudit.change_id,
        tAudit.date,
        tAudit.table_id,
        audit.table_config.name AS table_name,
        tAudit.primary_key,
        tAudit.action,
        tAudit.restricted,
        tAudit.meta_data_type,
        tAudit.meta_data,
        tAudit.created_by,
        tAudit.created_dts,
        tAudit.modified_by,
        tAudit.modified_dts,
        qID.table_names,
        qID.is_admin,
        qID.excluded_fields,
        ROW_NUMBER() OVER (PARTITION BY qID.input_idx ORDER BY tAudit.change_id DESC) AS rn
    FROM
        translated_audit AS tAudit
    LEFT JOIN audit.table_config ON tAudit.table_id = audit.table_config.id
    LEFT JOIN user_account AS actor ON tAudit.actor_id = actor.id
    JOIN KEYS_WITH_ACCESS_CHECK AS qID ON tAudit.model_plan_id = qID.model_plan_id
    WHERE
        (
            (tAudit.restricted = FALSE AND qID.has_restricted_access = FALSE) -- user does not have access to restricted audits, only show non-restricted
            OR qID.has_restricted_access = TRUE
        ) -- show all audits if the user has access to restricted audits
        AND (
            NOT (qID.should_filter)
            OR  table_config.name = ANY(qID.table_names) -- filter by table names
        )
        AND (         
            NOT (qID.should_exclude_fields)        
            OR
            (
                -- This ensures that theres is at least one field that is not excluded, or there are no fields (like for an insert)
                EXISTS (
                    SELECT 1
                    FROM translated_audit_field taf
                    WHERE
                        taf.translated_audit_id = tAudit.id
                        AND (
                            taf.field_name IS NULL
                            OR
                            taf.field_name <> ALL(qID.excluded_fields)
                        )
                )
            )
        )
)

SELECT 
    id,
    model_plan_id,
    actor_id,
    actor_name,
    change_id,
    date,
    table_id,
    table_name,
    primary_key,
    action,
    restricted,
    meta_data_type,
    meta_data,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    table_names,
    is_admin,
    excluded_fields
FROM RANKED_AUDIT
WHERE rn = 1  -- note, if desired we could introduce a limit field in queried params which would enable variable number of records returned
ORDER BY input_idx;
