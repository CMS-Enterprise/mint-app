package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestOperationalNeedCollectionGetByModelPlanID() {
}

func (suite *ResolverSuite) TestOperationalNeedsGetByModelPlanID() {

}

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
