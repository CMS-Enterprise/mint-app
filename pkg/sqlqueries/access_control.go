package sqlqueries

import _ "embed"

//go:embed SQL/access_control/check_if_collaborator.sql
var checkIfCollaboratorSQL string

//go:embed SQL/access_control/check_if_collaborator_discussion_id.sql
var checkIfCollaboratorDiscussionIDSQL string

//go:embed SQL/access_control/check_if_collaborator_milestone_id.sql
var checkIfCollaboratorMilestoneIDSQL string

//go:embed SQL/access_control/check_if_collaborator_LOADER.sql
var checkIfCollaboratorLOADERSQL string

type accessControlScripts struct {
	CheckIfCollaborator               string
	CheckIfCollaboratorByDiscussionID string
	CheckIfCollaboratorByMilestoneID  string
	CheckIfCollaboratorLOADER         string
}

// AccessControl houses all the sql for getting data for access control from the database
var AccessControl = accessControlScripts{
	CheckIfCollaborator:               checkIfCollaboratorSQL,
	CheckIfCollaboratorByDiscussionID: checkIfCollaboratorDiscussionIDSQL,
	CheckIfCollaboratorByMilestoneID:  checkIfCollaboratorMilestoneIDSQL,
	CheckIfCollaboratorLOADER:         checkIfCollaboratorLOADERSQL,
}
