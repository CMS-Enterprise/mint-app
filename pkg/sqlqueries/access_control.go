package sqlqueries

import _ "embed"

//go:embed SQL/access_control/check_if_collaborator.sql
var checkIfCollaboratorSQL string

//go:embed SQL/access_control/check_if_collaborator_discussion_id.sql
var checkIfCollaboratorDiscussionIDSQL string

//go:embed SQL/access_control/check_if_collaborator_by_solution_id.sql
var checkIfCollaboratorBySolutionIDSQL string

//go:embed SQL/access_control/check_if_collaborator_by_operational_need_id.sql
var checkIfCollaboratorByOperationalNeedIDSQL string

type accessControlScripts struct {
	CheckIfCollaborator                    string
	CheckIfCollaboratorByDiscussionID      string
	CheckIfCollaboratorBySolutionID        string
	CheckIfCollaboratorByOperationalNeedID string
}

// AccessControl houses all the sql for getting data for access control from the database
var AccessControl = accessControlScripts{
	CheckIfCollaborator:                    checkIfCollaboratorSQL,
	CheckIfCollaboratorByDiscussionID:      checkIfCollaboratorDiscussionIDSQL,
	CheckIfCollaboratorBySolutionID:        checkIfCollaboratorBySolutionIDSQL,
	CheckIfCollaboratorByOperationalNeedID: checkIfCollaboratorByOperationalNeedIDSQL,
}
