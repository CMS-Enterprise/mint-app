package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestOperationalNeedCollectionGetByModelPlanID() {
	plan := suite.createModelPlan("plan for need")

	//1. Get all current possible needs
	posNeeds, err := PossibleOperationalNeedCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(posNeeds)
	possibleCount := len(posNeeds)

	//2. Get all Operational Needs
	opNeeds, err := OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(opNeeds, possibleCount)
	firstNeed := opNeeds[0]

	suite.Nil(firstNeed.ModifiedBy)
	suite.Nil(firstNeed.ModifiedDts)
	suite.Nil(firstNeed.NameOther)
	suite.EqualValues(firstNeed.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.NotNil(firstNeed.CreatedDts)
	suite.NotNil(firstNeed.Name) // Enforce returning the name from this query //TODO
	suite.Nil(firstNeed.Needed)  //Needed should not yet be set

}

func (suite *ResolverSuite) TestOperationalNeedInsertOrUpdateCustom() {
	// 1. Create need, ensure fields are as expected
	plan := suite.createModelPlan("plan for need")
	needed := true
	customNeed := "To test my Operational Need resolver Logic"
	need, err := OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need)
	suite.Nil(need.ModifiedBy)
	suite.Nil(need.ModifiedDts)

	suite.Nil(need.Key)
	suite.Nil(need.Name)
	suite.EqualValues(need.NameOther, &customNeed)
	suite.EqualValues(need.Needed, &needed)

	//2. Update need and make sure fields change. A Different Key means a different entry
	needed = false
	need, err = OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need)
	suite.NotNil(need.ModifiedDts)

	suite.EqualValues(need.Needed, &needed)
	suite.EqualValues(need.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need.ModifiedBy, &suite.testConfigs.Principal.EUAID)

}

func (suite *ResolverSuite) TestOperationalNeedCustomUpdateByID() {
	plan := suite.createModelPlan("plan for need")
	needed := true
	customNeed := "To test my Operational Need resolver Logic"
	need1, _ := OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)

	//1. Update need
	newNeed := "To make sure I can change custom Need types"
	needed = false
	need2, err := OperationalNeedCustomUpdateByID(suite.testConfigs.Logger, need1.ID, &newNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(need2.NameOther, &newNeed)
	suite.EqualValues(need2.Needed, &needed)
	suite.EqualValues(need2.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need2.ModifiedBy, &suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need1.ID, need2.ID)

	//2. Error when setting need to null
	_, err = OperationalNeedCustomUpdateByID(suite.testConfigs.Logger, need1.ID, nil, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)

}

func (suite *ResolverSuite) TestOperationalNeedGetByID() {
	plan := suite.createModelPlan("plan for need")

	needType := models.OpNKManageCd
	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NotNil(need)
	suite.NoError(err)

	needGet, err := OperationalNeedGetByID(suite.testConfigs.Logger, need.ID, suite.testConfigs.Store)
	suite.NotNil(needGet)
	suite.NoError(err)

	suite.EqualValues(needGet.ID, need.ID)

}
