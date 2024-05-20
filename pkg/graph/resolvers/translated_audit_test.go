package resolvers

import (
	"fmt"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

func (suite *ResolverSuite) TestTranslateAudit() {

	// beforeYesterday := yesterday.AddDate(0, 0, -1)

	//Changes: (ChChCh Changes!) This should really happen in the translated audit package, testing in the resolver package for now just for simplicity for a POC
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

	retTranslatedAuditsWithFields := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields)

	// Get the fields and make sure they have fields?
	suite.GreaterOrEqual(len(retTranslatedAuditsWithFields), 2) // Make sure there are at least 2 changes, and two fields

}

func (suite *ResolverSuite) dangerousAuditTranslationQueueAllItems() {
	arg := map[string]interface{}{}

	queued, err := sqlutils.SelectProcedure[models.TranslatedAuditQueue](suite.testConfigs.Store, sqlqueries.TranslatedAuditQueue.DANGEROUSQueueAllEntries, arg)
	suite.NoError(err)
	fmt.Printf("queued %d entries \r\n", len(queued))
}

func (suite *ResolverSuite) dangerousTranslateAllQueuedTranslatedAudits() []*models.TranslatedAuditWithTranslatedFields {
	queuedObjects, err := storage.TranslatedAuditQueueGetQueued(suite.testConfigs.Store)
	if err != nil {
		fmt.Printf("issue getting queued Objects to translate \r\n")
	}
	translatedAudits := []*models.TranslatedAuditWithTranslatedFields{}

	for _, queued := range queuedObjects {
		audit, translationErr := translatedaudit.TranslateAuditJobByID(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, queued.ChangeID, queued.ID)
		suite.NoError(translationErr, "error getting queued objects to translate")
		if translationErr == nil && audit != nil { // only return actual translated audits (preferences)
			translatedAudits = append(translatedAudits, audit)

		}
		// fmt.Println(fmt.Errorf("error getting queued objects to translate, %w", translationErr))
	}
	return translatedAudits
}

func (suite *ResolverSuite) dangerousQueueAndTranslateAllAudits() []*models.TranslatedAuditWithTranslatedFields {
	suite.dangerousAuditTranslationQueueAllItems()
	return suite.dangerousTranslateAllQueuedTranslatedAudits()
}
