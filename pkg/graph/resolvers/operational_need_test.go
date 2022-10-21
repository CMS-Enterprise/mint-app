package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// func (suite *ResolverSuite) TestOperationalNeedsGetByModelPlanID() {

// 	plan := suite.createModelPlan("plan for need")
// 	needKey := models.OpNKAcquireALearnCont
// 	needed := true

// 	//1. No Needs
// 	opNeeds, err := OperationalNeedsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.Len(opNeeds.Needs, 0)
// 	possibleCount := len(opNeeds.PossibleNeeds)
// 	suite.GreaterOrEqual(possibleCount, 1) //there is at least 1 possible need

// 	//2. 1 Standard need
// 	_, err = OperationalNeedInsertOrUpdate(suite.testConfigs.Logger, plan.ID, needKey, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)

// 	opNeeds, err = OperationalNeedsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.Len(opNeeds.Needs, 1)
// 	suite.Len(opNeeds.PossibleNeeds, possibleCount-1) //Remove existing possible need

// 	//3. 2 Standard needs
// 	needKey = models.OpNKAcquireAnEvalCont
// 	_, err = OperationalNeedInsertOrUpdate(suite.testConfigs.Logger, plan.ID, needKey, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)

// 	opNeeds, err = OperationalNeedsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.Len(opNeeds.Needs, 2)
// 	suite.Len(opNeeds.PossibleNeeds, possibleCount-2) //Remove existing possible need

// 	//4. 2 Standard needs, 1 custom

// 	customNeed := "To test my Operational Need resolver Logic"
// 	_, err = OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)

// 	opNeeds, err = OperationalNeedsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.Len(opNeeds.Needs, 3)
// 	suite.Len(opNeeds.PossibleNeeds, possibleCount-2) //Remove existing possible need

// }

func (suite *ResolverSuite) TestOperationalNeedInsertOrUpdate() {

	// 1. Create need, ensure fields are as expected
	plan := suite.createModelPlan("plan for need")
	needKey := models.OpNKAcquireALearnCont
	needed := true
	need, err := OperationalNeedInsertOrUpdate(suite.testConfigs.Logger, plan.ID, needKey, needed, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.NotNil(need)
	suite.Nil(need.ModifiedBy)
	suite.Nil(need.ModifiedDts)
	suite.Nil(need.NameOther)

	suite.EqualValues(need.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.NotNil(need.CreatedDts)
	suite.EqualValues(need.Key, &needKey)
	suite.NotNil(need.Name) // Enforce returning the name from this query //TODO
	suite.EqualValues(need.Needed, needed)

	//2. Update need and make sure fields change. A Different Key means a different entry
	needed = false
	need, err = OperationalNeedInsertOrUpdate(suite.testConfigs.Logger, plan.ID, needKey, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need)
	suite.NotNil(need.ModifiedDts)

	suite.EqualValues(need.Needed, needed)
	suite.EqualValues(need.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need.ModifiedBy, &suite.testConfigs.Principal.EUAID)

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
	suite.EqualValues(need.Needed, needed)

	//2. Update need and make sure fields change. A Different Key means a different entry
	needed = false
	need, err = OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need)
	suite.NotNil(need.ModifiedDts)

	suite.EqualValues(need.Needed, needed)
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
	suite.EqualValues(need2.Needed, needed)
	suite.EqualValues(need2.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need2.ModifiedBy, &suite.testConfigs.Principal.EUAID)
	suite.EqualValues(need1.ID, need2.ID)

	//2. Error when setting need to null
	_, err = OperationalNeedCustomUpdateByID(suite.testConfigs.Logger, need1.ID, nil, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)

}
