CREATE TABLE mto_milestone_solution_link(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID NOT NULL REFERENCES mto_milestone(id),
    solution_id UUID NOT NULL REFERENCES mto_solution(id),
    
    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
COMMENT ON TABLE mto_milestone_solution_link IS 'Links solutions to milestones';

CREATE UNIQUE INDEX idx_milestone_solution ON mto_milestone_solution_link (milestone_id, solution_id);

COMMENT ON INDEX idx_milestone_solution IS 'Ensures uniqueness of milestone and solution combinations.';
