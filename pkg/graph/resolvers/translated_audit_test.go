package resolvers

import (
	"bytes"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/translatedaudit"
)

func (suite *ResolverSuite) TestTranslatedAuditGetMostRecentByModelPlanIDAndTableNames() {
	plan1 := suite.createModelPlan("test plan for changes1")
	plan2 := suite.createModelPlan("test plan for changes2")
	plan3 := suite.createModelPlan("test plan for changes3")

	suite.dangerousQueueAndTranslateAllAudits()
	// TODO verify this and expand to be a more robust validation
	expectedResults := []loaders.KeyAndExpected[storage.MostRecentByModelPlanIDAndTableFilters, models.TableName]{
		{Key: storage.MostRecentByModelPlanIDAndTableFilters{
			ModelPlanID:    plan1.ID,
			TableNames:     helpers.JoinStringSlice([]models.TableName{models.TNPlanOpsEvalAndLearning}, true),
			ExcludedFields: "{}",
			IsAdmin:        false,
		}, Expected: models.TNPlanOpsEvalAndLearning},
		{Key: storage.MostRecentByModelPlanIDAndTableFilters{
			ModelPlanID:    plan2.ID,
			TableNames:     helpers.JoinStringSlice([]models.TableName{models.TNPlanBasics}, true),
			ExcludedFields: "{}",
			IsAdmin:        false,
		}, Expected: models.TNPlanBasics},
		{Key: storage.MostRecentByModelPlanIDAndTableFilters{
			ModelPlanID:    plan3.ID,
			TableNames:     helpers.JoinStringSlice([]models.TableName{models.TNPlanGeneralCharacteristics}, true),
			ExcludedFields: "{}",
			IsAdmin:        false,
		}, Expected: models.TNPlanGeneralCharacteristics},
	}

	//TODO update this to create more test data. We should verify that updates, deletes, excluded fields, etc are all accounted for.
	// Perhaps we should also include a more expansive expected variable to show field count etc? (So we can validate if a field is excluded etc?)
	// Can verify last suggested status is updated by including multiple tables to check, updating two, and making sure it isn't model plan if only status was updated
	verifyFunc := func(data *models.TranslatedAudit, expected models.TableName) bool {
		if data == nil {
			return false
		}
		return data.TableName == expected
	}

	loaders.VerifyLoaders(suite.testConfigs.Context, &suite.Suite, loaders.TranslatedAudit.MostRecentByModelPlanIDAndTableFilters, expectedResults, verifyFunc)
}
func (suite *ResolverSuite) TestTranslatedAuditCollectionGetByModelPlanID() {
	plan := suite.createModelPlan("test plan for changes")

	suite.dangerousQueueAndTranslateAllAudits()

	planChanges := map[string]interface{}{
		"modelName":    "NEW_AND_IMPROVED",
		"abbreviation": "some model abbreviation",
		"status":       models.ModelStatusIcipComplete,
		"archived":     true,
	}
	_, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, planChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	translatedAudits, err := TranslatedAuditCollectionGetByModelPlanID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		plan.ID,
		nil,
		nil,
	)
	suite.NoError(err)
	suite.GreaterOrEqual(len(translatedAudits), 5)

	// Expect only 1 entry for ops eval and learning
	Audits, err := TranslatedAuditCollectionGetByModelPlanIDAndTableNames(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		plan.ID,
		[]models.TableName{models.TNPlanOpsEvalAndLearning},
		nil,
		nil,
	)
	suite.NoError(err)
	suite.Len(Audits, 1)

	// Expect 3 entries for plan participants and providers, model plan, and model plan ops eval and learning
	Audits, err = TranslatedAuditCollectionGetByModelPlanIDAndTableNames(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		plan.ID,
		[]models.TableName{models.TNPlanOpsEvalAndLearning, models.TNModelPlan, models.TNPlanParticipantsAndProviders},
		nil,
		nil,
	)
	suite.NoError(err)
	suite.Len(Audits, 3)

}
func (suite *ResolverSuite) TestTranslateAudit() {

	//This method comes from the translatedaudit package. However, we are testing it for an integration test.
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
func (suite *ResolverSuite) TestTranslateAuditDocSolLinkWorksWhenDataIsUnreadable() {

	//make an document solution link, delete the document and confirm it still works

	solution, _, plan := suite.createOperationalSolution()
	suite.TestPlanDocumentSolutionLinkCreateAndRemove()

	reader := bytes.NewReader([]byte("Some test file contents"))
	doc, err := suite.createTestPlanDocument(plan, reader)
	suite.NoError(err)
	retTranslatedAuditsWithFields := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields)

	_, err = PlanDocumentSolutionLinksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		solution.ID, []uuid.UUID{doc.ID},

		suite.testConfigs.Principal,
	)
	suite.NoError(err)

	_, err = PlanDocumentDelete(suite.testConfigs.Logger, suite.testConfigs.S3Client, doc.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// translate fields now and assert it was ok
	retTranslatedAuditsWithFields2 := suite.dangerousQueueAndTranslateAllAudits()
	suite.NotNil(retTranslatedAuditsWithFields2)

	// We expect two audits
	suite.Equal(len(retTranslatedAuditsWithFields2), 3) // Make sure there are 2 audits for this

}

func (suite *ResolverSuite) TestTranslateAuditCRAndTDLWorksWhenDataIsUnreadable() {
	plan := suite.createModelPlan("plan name")
	retTranslatedAuditsWithFields := suite.dangerousQueueAndTranslateAllAudits()
	suite.GreaterOrEqual(len(retTranslatedAuditsWithFields), 2)

	crID := "hooray my cr ID"
	tdlID := "hooray my tdl ID"
	crTitle := "CR title"
	tdlTitle := "TDL title"
	dateInitiated := time.Now()
	dateImplemented := dateInitiated
	crNote := "cr note"
	tdlNote := "tdl note"

	cr := suite.createPlanCR(plan, crID, dateInitiated, dateImplemented, crTitle, crNote)
	sharedChanges := map[string]interface{}{
		"note": " hello",
	}
	_, err := PlanCRUpdate(suite.testConfigs.Logger, cr.ID, sharedChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	_, err = PlanCRDelete(suite.testConfigs.Logger, cr.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	tdl := suite.createPlanTDL(plan, tdlID, dateInitiated, tdlTitle, tdlNote)
	_, err = PlanTDLUpdate(suite.testConfigs.Logger, tdl.ID, sharedChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	_, err = PlanTDLDelete(suite.testConfigs.Logger, tdl.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	// 6 records total, 2 for create, 2 for update, 2 for delete

	// Update statement doesn't have name in the fields changes, and isn't able to query from the db since the record is deleted. These should all still translate as optional fields
	retTranslatedAuditsWithFields2 := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields2)
	suite.Len(retTranslatedAuditsWithFields2, 6)

}

func (suite *ResolverSuite) TestTranslateAuditCollaboratorWorksWhenDataIsUnreadable() {
	plan := suite.createModelPlan("Plan For collaborator tests")
	retTranslatedAuditsWithFields := suite.dangerousQueueAndTranslateAllAudits()
	suite.GreaterOrEqual(len(retTranslatedAuditsWithFields), 2)

	collaborator := suite.createPlanCollaborator(plan, "CLAB", []models.TeamRole{models.TeamRoleLeadership})
	suite.Nil(collaborator.ModifiedBy)
	suite.Nil(collaborator.ModifiedDts)

	_, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		collaborator.ID,
		[]models.TeamRole{models.TeamRoleEvaluation},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	_, err = PlanCollaboratorDelete(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Even though collaborator is deleted and no longer reference-able, this is still able to be translated, as the user id is a foreign key reference
	// 3 changes. 1 for create, 1 for update, 1 for delete.
	retTranslatedAuditsWithFields2 := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields2)
	suite.Len(retTranslatedAuditsWithFields2, 3)

}

func (suite *ResolverSuite) dangerousAuditTranslationQueueAllItems() {
	arg := map[string]interface{}{}

	queued, err := sqlutils.SelectProcedure[models.TranslatedAuditQueue](suite.testConfigs.Store, sqlqueries.TranslatedAuditQueue.DANGEROUSQueueAllEntries, arg)
	suite.NoError(err)
	suite.testConfigs.Logger.Debug(fmt.Sprintf("queued %d entries", len(queued)), zap.Int("queue_count", len(queued)))

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
	}
	return translatedAudits
}

func (suite *ResolverSuite) dangerousQueueAndTranslateAllAudits() []*models.TranslatedAuditWithTranslatedFields {
	suite.dangerousAuditTranslationQueueAllItems()
	return suite.dangerousTranslateAllQueuedTranslatedAudits()
}
