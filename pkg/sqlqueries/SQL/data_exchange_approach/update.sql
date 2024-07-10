UPDATE data_exchange_approach
SET
    high_level_overview = :high_level_overview,
    new_methods = :new_methods,
    feasibility = :feasibility,
    participant_burden = :participant_burden,
    cmmi_impact = :cmmi_impact,
    additional_considerations = :additional_considerations,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP,
    status = :status
WHERE data_exchange_approach.id = :id
RETURNING id,
model_plan_id,
high_level_overview,
new_methods,
feasibility,
participant_burden,
cmmi_impact,
additional_considerations,
created_by,
created_dts,
modified_by,
modified_dts,
status;
