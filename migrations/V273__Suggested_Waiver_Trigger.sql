-- Trigger function to keep suggested_waiver in sync with waiver_assessment_survey.
-- Uses MERGE (same pattern as SET_SUGGESTED_MTO_MILESTONE in V196) so that rows which
-- remain suggested are left untouched — preserving their change history — while only
-- newly-qualifying rows are inserted and no-longer-qualifying rows are deleted.
--
-- survey_question_field on common_waiver is a column name on waiver_assessment_survey.
-- The trigger uses hstore to look up the field value dynamically, avoiding hardcoded
-- per-field CASE logic. NULL survey_question_field means always suggest.
-- On UPDATE, only common_waiver rows whose mapped field actually changed are processed
-- so that the MERGE is a no-op when unrelated columns are saved.
--
-- TODO: populate common_waiver.survey_question_field once CMS provides real
-- waiver-to-question mappings. Until then the ELSE TRUE branch suggests every waiver.
CREATE OR REPLACE FUNCTION MANAGE_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $body$
DECLARE
    actor        UUID;
    h_new        HSTORE;
    h_old        HSTORE;
    changed_keys TEXT[];
BEGIN
    actor = COALESCE(NEW.modified_by, NEW.created_by);
    h_new = hstore(NEW.*);

    IF TG_OP = 'INSERT' THEN
        -- Treat all fields as changed so every common_waiver is evaluated on initial seed
        changed_keys = '{*}'::TEXT[];
    ELSE
        h_old = hstore(OLD.*);
        changed_keys = akeys(h_new - h_old);
    END IF;

    MERGE INTO suggested_waiver AS target
    USING (
        SELECT
            cw.id AS common_waiver_id,
            CASE
                WHEN cw.survey_question_field IS NULL THEN TRUE
                -- Dynamically look up the field value by name; NULL answer means still suggest
                ELSE COALESCE((h_new -> cw.survey_question_field)::BOOLEAN, TRUE)
            END AS suggested
        FROM common_waiver cw
        -- On UPDATE: skip waivers whose mapped field did not change (no-op optimization)
        WHERE cw.survey_question_field IS NULL
           OR changed_keys = '{*}'::TEXT[]
           OR cw.survey_question_field = ANY(changed_keys)
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
rows that remain suggested, preserving their audit history.
Uses hstore to resolve survey_question_field values dynamically; on UPDATE only
processes common_waiver rows whose mapped field actually changed.';

CREATE TRIGGER seed_suggested_waivers
AFTER INSERT ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();

CREATE TRIGGER recalculate_suggested_waivers
AFTER UPDATE ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();
