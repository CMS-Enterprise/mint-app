package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

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

}

func (suite *ResolverSuite) TestCreateOrGetTagEntityID() {

}

func (suite *ResolverSuite) TestTagCollectionCreate() {

}
