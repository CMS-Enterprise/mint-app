package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanDocumentSolutionLinkCreateAndRemove() {
	plan := suite.createModelPlan("Plan with Documents")

	reader := bytes.NewReader([]byte("Some test file contents"))

	var documentIDs []uuid.UUID
	document, err := suite.createTestPlanDocument(plan, reader)
	suite.NoError(err)
	documentIDs = append(documentIDs, document.ID)
	document, err = suite.createTestPlanDocument(plan, reader)
	suite.NoError(err)
	documentIDs = append(documentIDs, document.ID)
	suite.EqualValues(len(documentIDs), 2)

	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = false
	defStatus := models.OpSNotStarted

	sol, err := OperationalSolutionInsertOrUpdate(
		suite.testConfigs.Logger,
		need.ID,
		solType,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.NotNil(sol)

	//nil fields
	suite.Nil(sol.NameOther)
	suite.Nil(sol.PocName)
	suite.Nil(sol.PocEmail)
	suite.Nil(sol.MustStartDts)
	suite.Nil(sol.MustFinishDts)
	suite.Nil(sol.ModifiedBy)
	suite.Nil(sol.ModifiedDts)

	suite.NotNil(sol.OperationalNeedID)

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.ID())
	suite.NotNil(sol.CreatedDts)
	suite.NotNil(sol.Name)
	suite.EqualValues(*sol.Needed, false)
	suite.EqualValues(sol.Key, &solType)
	suite.EqualValues(sol.Status, defStatus)

	createdPlanDocumentSolutionLinks, err := PlanDocumentSolutionLinksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		sol.ID,
		documentIDs,
		suite.testConfigs.Principal,
	)

	suite.NotNil(createdPlanDocumentSolutionLinks)
	suite.EqualValues(2, len(createdPlanDocumentSolutionLinks))
	suite.NoError(err)

	wasPlanDocumentRemoveSuccess, err := PlanDocumentSolutionLinkRemove(
		suite.testConfigs.Logger,
		createdPlanDocumentSolutionLinks[0].ID,
		suite.testConfigs.Store,
	)

	suite.True(wasPlanDocumentRemoveSuccess)
	suite.NoError(err)

	wasPlanDocumentRemoveSuccess, err = PlanDocumentSolutionLinkRemove(
		suite.testConfigs.Logger,
		createdPlanDocumentSolutionLinks[1].ID,
		suite.testConfigs.Store,
	)

	suite.True(wasPlanDocumentRemoveSuccess)
	suite.NoError(err)
}

func (suite *ResolverSuite) createTestPlanDocument(plan *models.ModelPlan, reader *bytes.Reader) (
	*models.PlanDocument,
	error,
) {
	input := &model.PlanDocumentInput{
		ModelPlanID: plan.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "sample.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		DocumentType: models.DocumentTypeConceptPaper,
		// OtherTypeDescription is nil
		// OptionalNotes is nil
	}
	document, err := PlanDocumentCreate(
		suite.testConfigs.Logger,
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
	)
	suite.NoError(err)

	// Assert values are what we expect
	suite.EqualValues(plan.ID, document.ModelPlanID)
	suite.EqualValues("application/msword", document.FileType)
	suite.EqualValues("sample.docx", document.FileName)
	suite.EqualValues(reader.Size(), document.FileSize)
	suite.False(document.VirusScanned)
	suite.False(document.VirusClean)
	suite.EqualValues(models.DocumentTypeConceptPaper, document.DocumentType)
	suite.Nil(document.OtherTypeDescription.Ptr())
	suite.Nil(document.OptionalNotes.Ptr())
	suite.Nil(document.DeletedAt)
	return document, err
}
