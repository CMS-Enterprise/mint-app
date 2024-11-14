CREATE TABLE mto_milestone_solution_link(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID NOT NULL REFERENCES mto_milestone(id),
    solution_id UUID NOT NULL REFERENCES mto_solution(id),
    
    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);
COMMENT ON TABLE mto_milestone_solution_link IS 'Links solutions to milestones';

CREATE UNIQUE INDEX idx_milestone_solution ON mto_milestone_solution_link (milestone_id, solution_id);

COMMENT ON INDEX idx_milestone_solution IS 'Ensures uniqueness of milestone and solution combinations.';
