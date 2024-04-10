package resolvers

import (
	"time"

	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

func (suite *ResolverSuite) TestTranslatedAuditFieldCollectionGetByTranslatedAuditID() {
	// beforeYesterday := yesterday.AddDate(0, 0, -1)

	// Changes: (ChChCh Changes!) This should really happen in the translated audit package, testing in the resolver package for now just for simplicity for a POC
	//Changes: (ChChCh Changes!) This could potentially be combined with the audit change test, but duplicating some logic here instead for clarity
	plan := suite.createModelPlan("test plan for changes")

	planChanges := map[string]interface{}{
		"modelName":    "NEW_AND_IMPROVED",
		"abbreviation": "some model abbreviation",
		"status":       models.ModelStatusIcipComplete,
		"archived":     true,
	}
	_, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, planChanges, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)

	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	opsEvalChanges := map[string]interface{}{
		"stakeholdersNote":                   "These stakeholders might change",
		"helpdeskUse":                        false,
		"technicalContactsIdentified":        true,
		"technicalContactsIdentifiedDetail":  "Mrs. Robinson",
		"dataSharingFrequencyContinually":    "some test value for data sharing frequency",
		"dataCollectionFrequencyContinually": "some test value for data collection frequency",
	}

	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, opsEvalChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(oel)

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	ppChanges := map[string]interface{}{
		"confidenceNote":                       "This is a confidence note",
		"recruitmentNote":                      "This is a recruitment note",
		"estimateConfidence":                   string(models.ConfidenceSlightly),
		"providerAdditionFrequencyContinually": "This is a provider addition frequency continually note",
	}

	updatedPP, err := PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, ppChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(updatedPP)

	today := time.Now()
	yesterday := today.AddDate(0, 0, -1)

	retTranslatedAuditsWithFields, changeErr := translatedaudit.TranslateAuditsForModelPlan(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, yesterday, today, plan.ID)
	suite.NoError(changeErr)
	suite.NotNil(retTranslatedAuditsWithFields)
	suite.GreaterOrEqual(len(retTranslatedAuditsWithFields), 2) // Make sure there are at least 2 changes, and two fields

	change1 := retTranslatedAuditsWithFields[0]
	change1FieldCount := len(change1.TranslatedFields)
	suite.Greater(change1FieldCount, 0)

	change2 := retTranslatedAuditsWithFields[1]
	change2FieldCount := len(change2.TranslatedFields)
	suite.Greater(change2FieldCount, 0)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		fields, err := TranslatedAuditFieldCollectionGetByTranslatedAuditID(ctx, change1.ID)
		suite.NoError(err)
		suite.NotNil(fields)
		suite.Len(fields, change1FieldCount)

		field := fields[0]
		suite.Equal(change1.ID, field.TranslatedAuditID)
		return nil

	})
	g.Go(func() error {
		fields, err := TranslatedAuditFieldCollectionGetByTranslatedAuditID(ctx, change2.ID)
		suite.NoError(err)
		suite.NotNil(fields)
		suite.Len(fields, change2FieldCount)
		field := fields[0]
		suite.Equal(change2.ID, field.TranslatedAuditID)
		return nil
	})
	err2 := g.Wait()
	suite.NoError(err2)

}
