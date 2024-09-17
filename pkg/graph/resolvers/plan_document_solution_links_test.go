package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
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
	document, err = suite.createTestPlanDocument(plan, reader)
	suite.NoError(err)
	documentIDs = append(documentIDs, document.ID)
	suite.EqualValues(len(documentIDs), 3)

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

	sol, err := OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		need.ID,
		&solType,
		changes,
		suite.testConfigs.Principal,
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

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.NotNil(sol.CreatedDts)
	suite.NotNil(sol.Name)
	suite.EqualValues(*sol.Needed, false)
	suite.EqualValues(sol.Key, &solType)
	suite.EqualValues(sol.Status, defStatus)

	// Ensure we should see 0 linked solutions for each document
	for _, docID := range documentIDs {
		eachNumLinks, eachErr := PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, docID)
		suite.NoError(eachErr)
		suite.Equal(0, eachNumLinks)
	}

	// Link all 3 documents
	createdPlanDocumentSolutionLinks, err := PlanDocumentSolutionLinksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		sol.ID,
		documentIDs,
		suite.testConfigs.Principal,
	)

	// Assert we have 3 links
	suite.NotNil(createdPlanDocumentSolutionLinks)
	suite.EqualValues(3, len(createdPlanDocumentSolutionLinks))
	suite.NoError(err)

	// Ensure we should see 1 linked solution for each document
	for _, docID := range documentIDs {
		eachNumLinks, eachErr := PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, docID)
		suite.NoError(eachErr)
		suite.Equal(1, eachNumLinks)
	}

	// Remove 2 of the documents
	wasPlanDocumentRemoveSuccess, err := PlanDocumentSolutionLinkRemove(
		suite.testConfigs.Logger,
		sol.ID,
		[]uuid.UUID{
			createdPlanDocumentSolutionLinks[0].DocumentID,
			createdPlanDocumentSolutionLinks[1].DocumentID,
		},
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
	)

	suite.True(wasPlanDocumentRemoveSuccess)
	suite.NoError(err)

	// Should now have 0 links for documentIDs[1], 0 links for documentIDs[1], and 1 link for documentIDs[2]
	numLinks, err := PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, documentIDs[0])
	suite.NoError(err)
	suite.Equal(0, numLinks)
	numLinks, err = PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, documentIDs[1])
	suite.NoError(err)
	suite.Equal(0, numLinks)
	numLinks, err = PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, documentIDs[2])
	suite.NoError(err)
	suite.Equal(1, numLinks)

	// Remove the final link
	wasPlanDocumentRemoveSuccess, err = PlanDocumentSolutionLinkRemove(
		suite.testConfigs.Logger,
		sol.ID,
		[]uuid.UUID{
			createdPlanDocumentSolutionLinks[2].DocumentID,
		},
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
	)

	suite.True(wasPlanDocumentRemoveSuccess)
	suite.NoError(err)

	// Ensure we should see 0 linked solutions for each document, now that they've all been removed
	for _, docID := range documentIDs {
		eachNumLinks, eachErr := PlanDocumentNumLinkedSolutions(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, docID)
		suite.NoError(eachErr)
		suite.Equal(0, eachNumLinks)
	}
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
