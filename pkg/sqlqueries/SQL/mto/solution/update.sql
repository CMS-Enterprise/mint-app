WITH retVal AS (
    UPDATE mto_solution
    SET
        model_plan_id= :model_plan_id,
        mto_common_solution_key= :mto_common_solution_key,
        name= :name,
        type= :type,
        facilitated_by= :facilitated_by,
        needed_by= :needed_by,
        status= :status,
        risk_indicator= :risk_indicator,
        poc_name= :poc_name,
        poc_email= :poc_email,
        modified_by= :modified_by,
        modified_dts=CURRENT_TIMESTAMP
    WHERE mto_solution.id= :id
    RETURNING
    id,
    model_plan_id,
    mto_common_solution_key,
    name,
    type,
    facilitated_by,
    needed_by,
    status,
    risk_indicator,
    poc_name,
    poc_email,
    created_by,
    created_dts,
    modified_by,
    modified_dts
)

SELECT
    retVal.id,
    retVal.model_plan_id,
    retVal.mto_common_solution_key,
    COALESCE(retVal.name, mto_common_solution.name) AS "name",
    COALESCE(retVal.type, mto_common_solution.type) AS "type",
    retVal.facilitated_by,
    retVal.needed_by,
    retVal.status,
    retVal.risk_indicator,
    retVal.poc_name,
    retVal.poc_email,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal
LEFT JOIN mto_common_solution ON retVal.mto_common_solution_key = mto_common_solution.key
