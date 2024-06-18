package resolvers

import (
	"bytes"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

func (suite *ResolverSuite) TestTranslateAudit() {

	// beforeYesterday := yesterday.AddDate(0, 0, -1)

	//Changes: (ChChCh Changes!) This should really happen in the translated audit package, testing in the resolver package for now just for simplicity
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

func (suite *ResolverSuite) TestTranslateAuditSolSubtaskWorksWhenDataIsUnreadable() {

	solution, _, _ := suite.createOperationalSolution()
	// queue and translate all audits before creating, updating, and deleting subtasks so we can isolate the changes specific to subtask modification
	retTranslatedAuditsWithFields := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields)

	createOperationalSolutionInput := []*model.CreateOperationalSolutionSubtaskInput{
		{
			Name:   "Subtask A",
			Status: models.OperationalSolutionSubtaskStatusTodo,
		},
		{
			Name:   "Subtask B",
			Status: models.OperationalSolutionSubtaskStatusInProgress,
		},
	}

	// 2 create audit entries
	subtasks := suite.createOperationalSolutionSubtasksWithSolution(
		solution,
		createOperationalSolutionInput,
	)
	updateInputs := suite.convertOperationalSubtasksToUpdateInputs(subtasks)

	updateInputs[0].Changes["status"] = models.OperationalSolutionSubtaskStatusDone
	updateInputs[1].Changes["status"] = models.OperationalSolutionSubtaskStatusTodo
	// 2 update audit entries
	_, err := OperationalSolutionSubtasksUpdateByID(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		updateInputs,
	)
	suite.NoError(err)

	// 2 more entries for delete.
	_, err = OperationalSolutionSubtaskDelete(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		subtasks[0].ID,
	)
	suite.NoError(err)

	_, err = OperationalSolutionSubtaskDelete(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		subtasks[1].ID,
	)
	suite.NoError(err)

	// Update statement doesn't have name in the fields changes, and isn't able to query from the db since the record is deleted. These should all still translate as optional fields
	retTranslatedAuditsWithFields2 := suite.dangerousQueueAndTranslateAllAudits()

	suite.NotNil(retTranslatedAuditsWithFields2)
	suite.Len(retTranslatedAuditsWithFields2, 6)

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
		// fmt.Println(fmt.Errorf("error getting queued objects to translate, %w", translationErr))
	}
	return translatedAudits
}

func (suite *ResolverSuite) dangerousQueueAndTranslateAllAudits() []*models.TranslatedAuditWithTranslatedFields {
	suite.dangerousAuditTranslationQueueAllItems()
	return suite.dangerousTranslateAllQueuedTranslatedAudits()
}
