ALTER TYPE TABLE_NAME ADD VALUE 'mto_milestone_solution_link';

CREATE TABLE mto_milestone_solution_link(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID NOT NULL REFERENCES mto_milestone(id) ON DELETE CASCADE,
    solution_id UUID NOT NULL REFERENCES mto_solution(id) ON DELETE CASCADE,
    
    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_milestone_solution_link IS 'Links solutions to milestones';

CREATE UNIQUE INDEX idx_milestone_solution ON mto_milestone_solution_link (milestone_id, solution_id);

COMMENT ON INDEX idx_milestone_solution IS 'Ensures uniqueness of milestone and solution combinations.';


CREATE OR REPLACE FUNCTION link_key_and_array(
    input_key TEXT,
    "values" TEXT[]
)
RETURNS TABLE (
    "key" TEXT,
    "value" TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        input_key as "key",
        UNNEST(values) AS "value";
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION link_key_and_array IS 'Returns an unnested combination of keys and values in a tabular form.'
