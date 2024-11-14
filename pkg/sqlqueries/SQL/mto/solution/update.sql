-- -- auto-generated definition
-- create table mto_solution
-- (
--   id                      uuid                                                            not null
--     primary key,
--   model_plan_id           uuid                                                            not null
--     references model_plan,
--   mto_common_solution_key mto_common_solution_key
--     references mto_common_solution,
--   name                    zero_string,
--   type                    mto_solution_type,
--   facilitated_by          mto_facilitator,
--   status                  mto_solution_status                                             not null,
--   risk_indicator          mto_risk_indicator       default 'ON_TRACK'::mto_risk_indicator not null,
--   poc_name                zero_string                                                     not null,
--   poc_email               email                                                           not null,
--   created_by              uuid                                                            not null
--     references user_account,
--   created_dts             timestamp with time zone default CURRENT_TIMESTAMP              not null,
--   modified_by             uuid
--     references user_account,
--   modified_dts            timestamp with time zone,
--   constraint unique_mto_common_solution_per_model_plan
--     unique (model_plan_id, mto_common_solution_key),
--   constraint check_name_type_and_common_solution
--     check (((mto_common_solution_key IS NULL) AND (name IS NOT NULL) AND (type IS NOT NULL)) OR
--            ((mto_common_solution_key IS NOT NULL) AND (name IS NULL) AND (type IS NULL)))
-- );

WITH retVal AS (
    UPDATE mto_solution
    SET
        model_plan_id= :model_plan_id,
        mto_common_solution_key= :mto_common_solution_key,
        name= :name,
        type= :type,
        facilitated_by= :facilitated_by,
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
    retVal.type,
    retVal.facilitated_by,
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
