-- Trigger function to keep suggested_waiver in sync with waiver_assessment_survey.
-- Uses MERGE (same pattern as SET_SUGGESTED_MTO_MILESTONE in V196) so that rows which
-- remain suggested are left untouched — preserving their change history — while only
-- newly-qualifying rows are inserted and no-longer-qualifying rows are deleted.
-- survey_question_field on common_waiver drives the suggestion logic; NULL means always suggest.
-- TODO: populate common_waiver.survey_question_field once CMS provides real waiver-to-question
-- mappings; the ELSE TRUE branch currently suggests every waiver unconditionally.
CREATE OR REPLACE FUNCTION MANAGE_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $body$
DECLARE
    actor UUID;
BEGIN
    actor = COALESCE(NEW.modified_by, NEW.created_by);

    MERGE INTO suggested_waiver AS target
    USING (
        SELECT
            cw.id AS common_waiver_id,
            CASE
                WHEN cw.survey_question_field IS NULL THEN TRUE
                WHEN cw.survey_question_field = 'modifies_medicare_savings_programs'
                    THEN NEW.modifies_medicare_savings_programs IS NULL OR NEW.modifies_medicare_savings_programs
                WHEN cw.survey_question_field = 'impacts_site_of_care_payments'
                    THEN NEW.impacts_site_of_care_payments IS NULL OR NEW.impacts_site_of_care_payments
                WHEN cw.survey_question_field = 'impacts_medicaid_only_beneficiaries'
                    THEN NEW.impacts_medicaid_only_beneficiaries IS NULL OR NEW.impacts_medicaid_only_beneficiaries
                ELSE TRUE
            END AS suggested
        FROM common_waiver cw
    ) AS source
    ON target.model_plan_id = NEW.model_plan_id
       AND target.common_waiver_id = source.common_waiver_id

    WHEN MATCHED AND COALESCE(source.suggested, FALSE) <> TRUE THEN
        DELETE

    WHEN NOT MATCHED AND source.suggested = TRUE THEN
        INSERT (id, model_plan_id, common_waiver_id, created_by)
        VALUES (GEN_RANDOM_UUID(), NEW.model_plan_id, source.common_waiver_id, actor);

    RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION MANAGE_SUGGESTED_WAIVERS IS
'Keeps suggested_waiver in sync with waiver_assessment_survey via MERGE.
Inserts newly-suggested waivers and deletes disqualified ones without touching
rows that remain suggested, preserving their audit history.';

CREATE TRIGGER seed_suggested_waivers
AFTER INSERT ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();

CREATE TRIGGER recalculate_suggested_waivers
AFTER UPDATE ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();
