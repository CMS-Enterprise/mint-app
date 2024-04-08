package resolvers

// import (
// 	"time"

// 	"github.com/cmsgov/mint-app/pkg/humanizedaudit"
// 	"github.com/cmsgov/mint-app/pkg/models"
// )

// func (suite *ResolverSuite) TestHumanizeAuditsForModelPlan() {

// 	// beforeYesterday := yesterday.AddDate(0, 0, -1)

// 	//Ticket: (ChChCh Changes!) This should really happen in this package, testing in the resolver package for now just for simplicity for a POC
// 	plan := suite.createModelPlan("test plan for changes")

// 	planChanges := map[string]interface{}{
// 		"modelName":    "NEW_AND_IMPROVED",
// 		"abbreviation": "some model abbreviation",
// 		"status":       models.ModelStatusIcipComplete,
// 		"archived":     true,
// 	}
// 	_, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, planChanges, suite.testConfigs.Principal, suite.testConfigs.Store) // update plan with new user "UPDT"

// 	suite.NoError(err)

// 	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
// 	suite.NoError(err)

// 	opsEvalChanges := map[string]interface{}{
// 		"stakeholdersNote":                   "These stakeholders might change",
// 		"helpdeskUse":                        false,
// 		"technicalContactsIdentified":        true,
// 		"technicalContactsIdentifiedDetail":  "Mrs. Robinson",
// 		"dataSharingFrequencyContinually":    "some test value for data sharing frequency",
// 		"dataCollectionFrequencyContinually": "some test value for data collection frequency",
// 	}

// 	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, opsEvalChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.NotNil(oel)

// 	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
// 	suite.NoError(err)

// 	ppChanges := map[string]interface{}{
// 		"confidenceNote":                       "This is a confidence note",
// 		"recruitmentNote":                      "This is a recruitment note",
// 		"estimateConfidence":                   string(models.ConfidenceSlightly),
// 		"providerAdditionFrequencyContinually": "This is a provider addition frequency continually note",
// 	}

// 	updatedPP, err := PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, ppChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	suite.NotNil(updatedPP)

// 	today := time.Now()
// 	yesterday := today.AddDate(0, 0, -1)

// 	humanizedChange, changeErr := humanizedaudit.HumanizeAuditsForModelPlan(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, yesterday, today, plan.ID)
// 	suite.NoError(changeErr)
// 	suite.NotNil(humanizedChange)

// }
