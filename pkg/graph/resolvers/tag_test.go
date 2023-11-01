package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestTaggedHTMLGet() {
	plan := suite.createModelPlan("Test Plan for TaggedHTML")
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	content := "hello " + tag1

	discussion := suite.createPlanDiscussion(plan, content)

	taggedHTML, err := TaggedHTMLGet(suite.testConfigs.Logger, suite.testConfigs.Store, content, "plan_discussion", "content", discussion.ID)
	suite.NoError(err)
	suite.Len(taggedHTML.Tags, 1)
	suite.EqualValues(content, string(taggedHTML.RawContent))

}

func (suite *ResolverSuite) TestTagCollectionGet() {
	//TODO do we need to test this? It is done by the above test
	plan := suite.createModelPlan("Test Plan for TaggedHTML")
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	content := "hello " + tag1

	discussion := suite.createPlanDiscussion(plan, content)
	// tags, err := TagCollectionGet(logger, store, taggedTable, taggedField, taggedContentID)

	tags, err := TagCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store, "plan_discussion", "content", discussion.ID)
	suite.NoError(err)
	suite.Len(tags, 1)

}

func (suite *ResolverSuite) TestTaggedEntityGet() {

	// Get user account
	principalAccountID := suite.testConfigs.Principal.UserAccount.ID
	retPrincEntity, err := TaggedEntityGet(suite.testConfigs.Context, suite.testConfigs.Store, models.TagTypeUserAccount, &principalAccountID, nil)
	suite.NoError(err)
	retPrinc, ok := retPrincEntity.(*authentication.UserAccount)
	suite.True(ok, "Could not cast the Tagged Entity to User Account")

	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, retPrinc.ID)

	// Get Possible Operational Solution
	sol, err := PossibleOperationalSolutionGetByID(suite.testConfigs.Logger, suite.testConfigs.Store, 1)
	suite.NoError(err)
	suite.NotNil(sol)

	retSolEnt, err := TaggedEntityGet(suite.testConfigs.Context, suite.testConfigs.Store, models.TagTypePossibleSolution, nil, &sol.ID)
	suite.NoError(err)
	retSol, ok := retSolEnt.(*models.PossibleOperationalSolution)
	suite.True(ok, "Could not cast the Tagged Entity to Possible Operational Solution")

	suite.EqualValues(sol.ID, retSol.ID)

}

func (suite *ResolverSuite) TestCreateOrGetTagEntityID() {
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	tag2EUA := "TEST"
	tag2Label := "Terry Thompson"
	tag2Type := models.TagTypeUserAccount
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2EUA + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`
	tag3ID := "CONNECT"
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.`
	taggedHTML, err := models.NewTaggedHTMLFromString(htmlMention)
	suite.NoError(err)

	input := models.TaggedHTMLInput(taggedHTML)

	err = CreateOrGetTagEntityID(suite.testConfigs.Context, suite.testConfigs.Store, &input, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.Len(taggedHTML.Mentions, 3)

	tag1User, err := UserAccountGetByUsername(suite.testConfigs.Logger, suite.testConfigs.Store, tag1EUA)
	suite.NoError(err)
	suite.EqualValues(tag1User.ID, *taggedHTML.Mentions[0].EntityUUID)

	tag2User, err := UserAccountGetByUsername(suite.testConfigs.Logger, suite.testConfigs.Store, tag2EUA)
	suite.NoError(err)
	suite.EqualValues(tag2User.ID, *taggedHTML.Mentions[1].EntityUUID)

	// tag3Sol, err := Possible(suite.testConfigs.Logger, suite.testConfigs.Store, tag2EUA)
	tag3Sol, err := suite.testConfigs.Store.PossibleOperationalSolutionGetByKey(suite.testConfigs.Logger, models.OperationalSolutionKey(tag3ID))
	suite.NoError(err)
	suite.EqualValues(tag3Sol.ID, *taggedHTML.Mentions[2].EntityIntID)

	// if the data-id-db tag is set, the content won't be updated
	tag4EUA := "SKZO"
	tag4Label := "Alexander Stark"
	tag4Type := models.TagTypeUserAccount
	tag4 := `<span data-type="mention" tag-type="` + string(tag4Type) + `" class="mention" data-id="` + tag4EUA + `" data-id-db="` + tag4Label + `" data-label="` + tag4Label + `">@` + tag4Label + `</span>`

	tHTML, err := models.NewTaggedHTMLFromString(tag4)
	suite.NoError(err)
	input2 := models.TaggedHTMLInput(tHTML)
	err = CreateOrGetTagEntityID(suite.testConfigs.Context, suite.testConfigs.Store, &input2, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.Len(input2.Mentions, 1)
	suite.EqualValues(input2.Mentions[0].EntityDB, tag4Label)
	suite.EqualValues(string(input.RawContent), tag4)
}

func (suite *ResolverSuite) TestTagCollectionCreate() {
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	tag2EUA := "TEST"
	tag2Label := "Terry Thompson"
	tag2Type := models.TagTypeUserAccount
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2EUA + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`
	tag3ID := "CONNECT"
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.` + tag1 + tag1
	// We have made a mention with 5 Mentions. This should only create 5 tags in the database
	taggedHTML, err := models.NewTaggedHTMLFromString(htmlMention)
	suite.NoError(err)

	input := models.TaggedHTMLInput(taggedHTML)

	err = CreateOrGetTagEntityID(suite.testConfigs.Context, suite.testConfigs.Store, &input, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.Len(taggedHTML.Mentions, 5)

	fieldName := "nonsenseTestField"
	tableName := "nonsenseTableName"
	taggedContentID := uuid.New()

	tags, err := TagCollectionCreate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, fieldName, tableName, taggedContentID, taggedHTML.Mentions)
	suite.NoError(err) //ASSERT Tags are created

	// ASSERT that tags are not duplicated
	suite.Len(tags, 3)

}
