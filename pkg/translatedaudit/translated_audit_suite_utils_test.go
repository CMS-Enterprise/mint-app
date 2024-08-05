package translatedaudit

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreateModelPlan creates a model plan using the store. It doesn't do this in a transaction, and doesn't make
// any other relevant tables like the resolver does. It is just for testing
func (suite *TAuditSuite) createModelPlan(planName string) *models.ModelPlan {
	planToCreate := models.NewModelPlan(suite.testConfigs.Principal.UserAccount.ID, planName)
	retMP, err := suite.testConfigs.Store.ModelPlanCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		planToCreate,
	)
	suite.NoError(err)
	return retMP
}

// createOperationalNeed creates an operational need using the store. It is just for testing
func (suite *TAuditSuite) createOperationalNeed(modelPlanID uuid.UUID, customNeedType string) *models.OperationalNeed {

	needToCreate := models.NewOperationalNeed(suite.testConfigs.Principal.UserAccount.ID, modelPlanID)

	retNeed, err := suite.testConfigs.Store.OperationalNeedInsertOrUpdateOther(suite.testConfigs.Logger, needToCreate, customNeedType)
	suite.NoError(err)
	return retNeed
}

// createOperationalSolution creates an operational solution using the store. It is just for testing
func (suite *TAuditSuite) createOperationalSolution(operationalNeedID uuid.UUID, customSolution string, preHooks ...func(*models.OperationalSolution)) *models.OperationalSolution {

	solToCreate := models.NewOperationalSolution(suite.testConfigs.Principal.UserAccount.ID, operationalNeedID)
	solToCreate.NameOther = &customSolution
	for _, preHook := range preHooks {
		preHook(solToCreate)

	}

	retSol, err := suite.testConfigs.Store.OperationalSolutionInsert(suite.testConfigs.Logger, solToCreate, nil)
	suite.NoError(err)
	return retSol
}

// createOperationalSolutionSubtask creates an operational solution subtask using the store. It is just for testing
func (suite *TAuditSuite) createOperationalSolutionSubtask(solutionID uuid.UUID, subtaskName string, subtaskStatus *models.OperationalSolutionSubtaskStatus) *models.OperationalSolutionSubtask {

	if subtaskStatus == nil {
		status := models.OperationalSolutionSubtaskStatusTodo
		subtaskStatus = &status
	}

	subtaskToCreate := models.NewOperationalSolutionSubtask(suite.testConfigs.Principal.UserAccount.ID, uuid.New(), solutionID, subtaskName, *subtaskStatus)

	retSubTaskList, err := suite.testConfigs.Store.OperationalSolutionSubtasksCreate(suite.testConfigs.Logger, []*models.OperationalSolutionSubtask{subtaskToCreate})
	suite.NoError(err)
	if suite.Len(retSubTaskList, 1) {
		return retSubTaskList[0]
	}

	return nil
}

// createPlanDocument creates a test plan document for testing
func (suite *TAuditSuite) createPlanDocument(modelPlanID uuid.UUID, fileName string) *models.PlanDocument {

	document := models.NewPlanDocument(suite.testConfigs.Principal.UserAccount.ID,
		modelPlanID,
		"fileType",
		"bucket",
		uuid.NewString(),
		fileName,
		3,
		models.DocumentTypeOther,
		false,
		zero.StringFrom("test doc"),
		zero.StringFrom(""),
		false,
		zero.String{})

	retDocument, err := suite.testConfigs.Store.PlanDocumentCreate(suite.testConfigs.Logger, suite.testConfigs.Principal.UserAccount.ID.String(), document)
	suite.NoError(err)
	return retDocument

}

func (suite *TAuditSuite) deleteDocument(documentID uuid.UUID) {
	_, err := suite.testConfigs.Store.PlanDocumentDelete(suite.testConfigs.Logger, documentID, suite.testConfigs.Principal.UserAccount.ID)
	suite.NoError(err)
}

// createPlanDiscussion creates a test plan discussion for testing. It doesn't go through normal resolver procedures (eg there are no tags)
func (suite *TAuditSuite) createPlanDiscussion(modelPlanID uuid.UUID, content string) *models.PlanDiscussion {

	discussionUserRole := models.DiscussionRoleMintTeam
	taggedContent, err := models.NewTaggedContentFromString(content)
	suite.NoError(err)

	discussion := models.NewPlanDiscussion(suite.testConfigs.Principal.UserAccount.ID,
		false, modelPlanID,
		models.TaggedHTML(taggedContent),
		&discussionUserRole,
		nil,
	)

	retDisc, err := suite.testConfigs.Store.PlanDiscussionCreate(suite.testConfigs.Logger, discussion, suite.testConfigs.Store)

	suite.NoError(err)
	return retDisc
}

// createDiscussionReply creates a test  discussion reply for testing
func (suite *TAuditSuite) createDiscussionReply(discussionID uuid.UUID, content string) *models.DiscussionReply {

	discussionUserRole := models.DiscussionRoleMintTeam
	taggedContent, err := models.NewTaggedContentFromString(content)
	suite.NoError(err)

	discussionReply := models.NewDiscussionReply(suite.testConfigs.Principal.UserAccount.ID,
		false, discussionID,
		models.TaggedHTML(taggedContent),
		&discussionUserRole,
		nil,
	)

	retReply, err := storage.DiscussionReplyCreate(suite.testConfigs.Logger, discussionReply, suite.testConfigs.Store)

	suite.NoError(err)
	return retReply

}

func (suite *TAuditSuite) createDocumentSolutionLink(documentID uuid.UUID, solutionID uuid.UUID) *models.PlanDocumentSolutionLink {

	links := suite.createDocumentSolutionLinks([]uuid.UUID{documentID}, solutionID)
	if suite.Len(links, 1) {
		return links[0]
	}
	return nil
}
func (suite *TAuditSuite) createDocumentSolutionLinks(documentIDs []uuid.UUID, solutionID uuid.UUID) []*models.PlanDocumentSolutionLink {
	links, err := suite.testConfigs.Store.PlanDocumentSolutionLinksCreate(suite.testConfigs.Logger, solutionID, documentIDs, suite.testConfigs.Principal)
	suite.NoError(err)
	return links

}
func (suite *TAuditSuite) createPlanCR(modelPlanID uuid.UUID, idNumber string, preHooks ...func(*models.PlanCR)) *models.PlanCR {
	dateInitiated := time.Now().UTC()
	dateImplemented := time.Now().Add(time.Hour * 48).UTC()
	note := "My comments"

	planCR := models.NewPlanCR(suite.testConfigs.Principal.UserAccount.ID, modelPlanID)
	planCR.IDNumber = idNumber
	planCR.DateInitiated = &dateInitiated
	planCR.DateImplemented = &dateImplemented
	planCR.Title = "Test CR"
	planCR.Note = &note
	for _, preHook := range preHooks {
		preHook(planCR)
	}

	cr, err := suite.testConfigs.Store.PlanCRCreate(suite.testConfigs.Logger, planCR)
	suite.NoError(err)

	return cr

}
func (suite *TAuditSuite) createPlanTDL(modelPlanID uuid.UUID, idNumber string, preHooks ...func(*models.PlanTDL)) *models.PlanTDL {
	dateInitiated := time.Now().UTC()

	note := "My comments"

	planTDL := models.NewPlanTDL(suite.testConfigs.Principal.UserAccount.ID, modelPlanID)
	planTDL.IDNumber = idNumber
	planTDL.DateInitiated = &dateInitiated
	planTDL.Title = "Test TDL"
	planTDL.Note = &note
	for _, preHook := range preHooks {
		preHook(planTDL)
	}

	tdl, err := suite.testConfigs.Store.PlanTDLCreate(suite.testConfigs.Logger, planTDL)
	suite.NoError(err)

	return tdl

}

func (suite *TAuditSuite) deletePlanTDL(id uuid.UUID) *models.PlanTDL {
	tdl, err := suite.testConfigs.Store.PlanTDLDelete(suite.testConfigs.Logger, id, suite.testConfigs.Principal.UserAccount.ID)
	suite.NoError(err)
	return tdl
}
func (suite *TAuditSuite) deletePlanCR(id uuid.UUID) *models.PlanCR {
	cr, err := suite.testConfigs.Store.PlanCRDelete(suite.testConfigs.Logger, id, suite.testConfigs.Principal.UserAccount.ID)
	suite.NoError(err)
	return cr
}

func (suite *TAuditSuite) createPlanCollaborator(modelPlanID uuid.UUID, userName string) *models.PlanCollaborator {

	collabPrinc, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, userName)
	suite.NoError(err)

	roles := []models.TeamRole{models.TeamRoleModelLead, models.TeamRoleCOR}
	collaborator := models.NewPlanCollaborator(suite.testConfigs.Principal.UserAccount.ID, modelPlanID, collabPrinc.UserAccount.ID, roles)

	retCollaborator, err := suite.testConfigs.Store.PlanCollaboratorCreate(suite.testConfigs.Store, suite.testConfigs.Logger, collaborator)
	suite.NoError(err)
	return retCollaborator
}
