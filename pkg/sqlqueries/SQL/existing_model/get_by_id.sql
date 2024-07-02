SELECT
    eM.id,
    eM.model_name,
    eM.stage,
    eM.number_of_participants,
    eM.category,
    eM.authority,
    eM.description,
    eM.number_of_beneficiaries_impacted,
    eM.number_of_physicians_impacted,
    eM.date_began,
    eM.date_ended,
    eM.states,
    eM.keywords,
    eM.url,
    eM.display_model_summary,
    eM.created_by,
    eM.created_dts,
    eM.modified_by,
    eM.modified_dts
FROM existing_model AS eM 
WHERE eM.id = :id
