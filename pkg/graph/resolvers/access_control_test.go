package resolvers

import (
	"bytes"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// ErrorIfNotCollaborator returns an error if the user is not a collaborator. It wraps checks to see if it has a model plan, or Discussion relation, with priority given to ModelPlan
func (suite *ResolverSuite) TestErrorIfNotCollaborator() {
	plan := suite.createModelPlan("Test Plan") //plan created by TEST

	basicUserPrincipal := suite.testConfigs.Principal
	basicUserPrincipal.JobCodeUSER = true
	basicUserPrincipal.JobCodeASSESSMENT = false
	basicUserPrincipal.JobCodeMAC = false

	notCollab := suite.getTestPrincipal(suite.testConfigs.Store, "FAIL")
	notCollab.JobCodeUSER = true
	notCollab.JobCodeASSESSMENT = false
	notCollab.JobCodeMAC = false

	assessment := suite.getTestPrincipal(suite.testConfigs.Store, "FAIL")
	assessment.JobCodeUSER = true
	assessment.JobCodeASSESSMENT = true //Bypass Collaborator check
	assessment.JobCodeMAC = false

	macUser := suite.getTestPrincipal(suite.testConfigs.Store, "MyFunIDMUsername")
	macUser.JobCodeUSER = false
	macUser.JobCodeASSESSMENT = false
	macUser.JobCodeMAC = true

	//1. User is collaborator by modelPlanID
	err := accesscontrol.ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//2. User is  not collaborator by modelPlanID
	err = accesscontrol.ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//3. User is  not collaborator by modelPlanID, but is assessment user
	err = accesscontrol.ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, assessment, suite.testConfigs.Store)
	suite.NoError(err)

	//4. Mac Users are NEVER collaborators
	err = accesscontrol.ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, macUser, suite.testConfigs.Store)
	suite.Error(err)

	//  Create discussion and reply
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply")

	//5. User is collaborator by discusionID
	err = accesscontrol.ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//6. User is  not collaborator by discusionID
	err = accesscontrol.ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//7. User is  not collaborator by discusionID, but is assessment user
	err = accesscontrol.ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, assessment, suite.testConfigs.Store)
	suite.NoError(err)

	//8. Mac Users are NEVER collaborators
	err = accesscontrol.ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, macUser, suite.testConfigs.Store)
	suite.Error(err)

	//  Check Operational Need relation with Operational Solutions
	opNeeds, err := OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	solType := models.OpSKOutlookMailbox
	opSol, err := OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		opNeeds[0].ID,
		&solType,
		nil,
		suite.testConfigs.Principal)
	suite.NoError(err)

	//9. User is collaborator by solutionID
	err = accesscontrol.ErrorIfNotCollaborator(opSol, suite.testConfigs.Logger, basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//10. User is  not collaborator by solutionID
	err = accesscontrol.ErrorIfNotCollaborator(opSol, suite.testConfigs.Logger, notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//11. User is not collaborator by solutionID, but is assessment user
	err = accesscontrol.ErrorIfNotCollaborator(opSol, suite.testConfigs.Logger, assessment, suite.testConfigs.Store)
	suite.NoError(err)

	//12. Mac Users are NEVER collaborators
	err = accesscontrol.ErrorIfNotCollaborator(opSol, suite.testConfigs.Logger, macUser, suite.testConfigs.Store)
	suite.Error(err)

	// Check soultion relation with plan document solution link
	reader := bytes.NewReader([]byte("Some test file contents"))
	document, err := suite.createTestPlanDocument(plan, reader)
	suite.NoError(err)

	documentIDs := []uuid.UUID{document.ID}

	solutionLinks, err := PlanDocumentSolutionLinksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		opSol.ID,
		documentIDs,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)

	//13. User is collaborator by solutionID
	err = accesscontrol.ErrorIfNotCollaborator(solutionLinks[0], suite.testConfigs.Logger, basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//14. User is  not collaborator by solutionID
	err = accesscontrol.ErrorIfNotCollaborator(solutionLinks[0], suite.testConfigs.Logger, notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//15. User is not collaborator by solutionID, but is assessment user
	err = accesscontrol.ErrorIfNotCollaborator(solutionLinks[0], suite.testConfigs.Logger, assessment, suite.testConfigs.Store)
	suite.NoError(err)

	//16. Mac Users are NEVER collaborators
	err = accesscontrol.ErrorIfNotCollaborator(solutionLinks[0], suite.testConfigs.Logger, macUser, suite.testConfigs.Store)
	suite.Error(err)

}
