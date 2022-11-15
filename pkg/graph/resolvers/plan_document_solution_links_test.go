package resolvers

func (suite *ResolverSuite) TestPlanDocumentSolutionLinkCreateAndRemove() {
	// TODO: Fix me

	/*plan := suite.createModelPlan("Plan with Documents")

	reader := bytes.NewReader([]byte("Some test file contents"))

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
	document, err := PlanDocumentCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
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

	documentSolutionLinks := []*models.PlanDocumentSolutionLink{{
		SolutionID: uuid.Nil,
		DocumentID: document.ID,
	}}

	createdPlanDocumentSolutionLinks, err := PlanDocumentSolutionLinksCreate(suite.testConfigs.Logger, documentSolutionLinks, suite.testConfigs.Store, nil)

	suite.NotNil(createdPlanDocumentSolutionLinks)
	suite.EqualValues(1, len(createdPlanDocumentSolutionLinks))
	suite.NoError(err)

	wasPlanDocumentRemoveSuccess, err := PlanDocumentSolutionLinkRemove(
		suite.testConfigs.Logger,
		createdPlanDocumentSolutionLinks[0].ID,
		suite.testConfigs.Store,
	)

	suite.True(wasPlanDocumentRemoveSuccess)
	suite.NotNil(err)*/
}
