-- Validate that every common waiver maps to a boolean question on the waiver survey.
DO $body$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM common_waiver AS cw
        LEFT JOIN information_schema.columns AS survey_column
            ON survey_column.table_schema = 'public'
            AND survey_column.table_name = 'waiver_assessment_survey'
            AND survey_column.column_name = cw.survey_question_field
            AND survey_column.data_type = 'boolean'
        WHERE survey_column.column_name IS NULL
    ) THEN
        RAISE EXCEPTION 'Every common waiver must map to a boolean waiver assessment survey column';
    END IF;
END;
$body$;

-- Seed every common waiver as suggested when a waiver survey is created. Unanswered
-- questions do not rule out waivers, so the initial survey contains all common waivers.
CREATE OR REPLACE FUNCTION SEED_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $body$
BEGIN
    INSERT INTO suggested_waiver (
        id,
        model_plan_id,
        common_waiver_id,
        created_by
    )
    SELECT
        GEN_RANDOM_UUID(),
        NEW.model_plan_id,
        cw.id,
        COALESCE(NEW.modified_by, NEW.created_by)
    FROM common_waiver AS cw
    ON CONFLICT (model_plan_id, common_waiver_id) DO NOTHING;

    RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION SEED_SUGGESTED_WAIVERS IS
'Seeds every common waiver as suggested when a waiver assessment survey is created.';

-- Keep suggestions in sync when mapped survey answers actually change. Only an
-- explicit false rules out a waiver; true and NULL both keep it suggested.
CREATE OR REPLACE FUNCTION MANAGE_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $body$
DECLARE
    actor        UUID;
    h_new        HSTORE;
    changed_keys TEXT[];
BEGIN
    actor = COALESCE(NEW.modified_by, NEW.created_by);
    h_new = hstore(NEW.*);
    changed_keys = akeys(h_new - hstore(OLD.*));

    MERGE INTO suggested_waiver AS target
    USING (
        SELECT
            cw.id AS common_waiver_id,
            COALESCE((h_new -> cw.survey_question_field)::BOOLEAN, TRUE) AS suggested
        FROM common_waiver AS cw
        WHERE cw.survey_question_field = ANY(changed_keys)
    ) AS source
    ON target.model_plan_id = NEW.model_plan_id
       AND target.common_waiver_id = source.common_waiver_id

    WHEN MATCHED AND source.suggested = FALSE THEN
        DELETE

    WHEN NOT MATCHED AND source.suggested = TRUE THEN
        INSERT (id, model_plan_id, common_waiver_id, created_by)
        VALUES (GEN_RANDOM_UUID(), NEW.model_plan_id, source.common_waiver_id, actor);

    RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION MANAGE_SUGGESTED_WAIVERS IS
'Updates suggested waivers when mapped waiver assessment survey answers change.
Explicit false answers delete suggestions; true and NULL answers restore them.';

CREATE TRIGGER seed_suggested_waivers
AFTER INSERT ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION SEED_SUGGESTED_WAIVERS();

CREATE TRIGGER recalculate_suggested_waivers
AFTER UPDATE ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();
