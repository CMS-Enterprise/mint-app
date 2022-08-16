package resolvers

import "github.com/cmsgov/mint-app/pkg/authentication"

//ErrorIfNotCollaborator returns an error if the user is not a collaborator. It wraps checks to see if it has a model plan, or Discussion relation, with priority given to ModelPlan
func (suite *ResolverSuite) TestErrorIfNotCollaborator() {
	plan := suite.createModelPlan("Test Plan") //plan created by TEST

	basicUserPrincipal := authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.Principal.EUAID,
		JobCodeASSESSMENT: false, // so we don't bypass Collaborator check
		JobCodeUSER:       true,
	}
	notCollab := authentication.EUAPrincipal{
		EUAID:             "FAIL",
		JobCodeASSESSMENT: false, // so we don't bypass Collaborator check
		JobCodeUSER:       true,
	}

	assessment := authentication.EUAPrincipal{
		EUAID:             "FAIL",
		JobCodeASSESSMENT: true, //Bypass Collaborator check
		JobCodeUSER:       true,
	}

	//1. User is collaborator by modelPlanID
	err := ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, &basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//2. User is  not collaborator by modelPlanID
	err = ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, &notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//3. User is  not collaborator by modelPlanID, but is assessment user
	err = ErrorIfNotCollaborator(plan, suite.testConfigs.Logger, &assessment, suite.testConfigs.Store)
	suite.NoError(err)

	//  Create discussion and reply
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)

	//4. User is collaborator by discusionID
	err = ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, &basicUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)

	//5. User is  not collaborator by discusionID
	err = ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, &notCollab, suite.testConfigs.Store)
	suite.Error(err)

	//6. User is  not collaborator by discusionID, but is assessment user
	err = ErrorIfNotCollaborator(reply, suite.testConfigs.Logger, &assessment, suite.testConfigs.Store)
	suite.NoError(err)

}
