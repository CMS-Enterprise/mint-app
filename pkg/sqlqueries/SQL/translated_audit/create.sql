WITH retVal AS (
    INSERT INTO translated_audit(
        id,
        model_plan_id,
        actor_id,
        change_id,
        date,
        table_id,
        primary_key,
        action,
        restricted,
        meta_data_type,
        meta_data,
        created_by
    )
    VALUES (
        :id,
        :model_plan_id,
        :actor_id,
        :change_id,
        :date,
        :table_id,
        :primary_key,
        :action,
        :restricted,
        :meta_data_type,
        :meta_data,
        :created_by
    )
    RETURNING
        id,
        model_plan_id,
        actor_id,
        change_id,
        date,
        table_id,
        primary_key,
        action,
        restricted,
        meta_data_type,
        meta_data,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT 
    retVal.id,
    retVal.model_plan_id,
    retVal.actor_id,
    actor.common_name AS actor_name,
    retVal.change_id,
    retVal.date,
    retVal.table_id,
    table_config.name AS table_name,
    retVal.primary_key,
    retVal.action,
    retVal.restricted,
    retVal.meta_data_type,
    retVal.meta_data,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal
LEFT JOIN user_account AS actor ON retVal.actor_id = actor.id
LEFT JOIN audit.table_config ON retVal.table_id = table_config.id;
