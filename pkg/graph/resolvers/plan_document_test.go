package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanDocumentCreate() {
	plan := suite.createModelPlan("Plan with Documents")

	reader := bytes.NewReader([]byte("Some test file contents"))

	input := &model.PlanDocumentInput{
		ModelPlanID: plan.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "sample.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		Restricted:   false,
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
	suite.False(document.Restricted)
	suite.EqualValues(models.DocumentTypeConceptPaper, document.DocumentType)
	suite.Nil(document.OtherTypeDescription.Ptr())
	suite.Nil(document.OptionalNotes.Ptr())
	suite.Nil(document.DeletedAt)
}

func (suite *ResolverSuite) TestPlanDocumentCreateLinked() {
	plan := suite.createModelPlan("Plan with Documents")

	url := "https://www.google.com/"
	fileName := "Hooray.png"
	expectedFileType := "externalLink"

	input := model.PlanDocumentLinkInput{
		ModelPlanID:  plan.ID,
		Name:         fileName,
		URL:          url,
		Restricted:   false,
		DocumentType: models.DocumentTypeConceptPaper,
	}
	document, err := PlanDocumentCreateLinked(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Assert values are what we expect
	suite.EqualValues(plan.ID, document.ModelPlanID)
	suite.EqualValues(expectedFileType, document.FileType)
	suite.EqualValues(fileName, document.FileName)
	suite.EqualValues(0, document.FileSize)
	suite.False(document.VirusScanned)
	suite.False(document.VirusClean)
	suite.False(document.Restricted)
	suite.EqualValues(models.DocumentTypeConceptPaper, document.DocumentType)
	suite.Nil(document.OtherTypeDescription.Ptr())
	suite.Nil(document.OptionalNotes.Ptr())
	suite.Nil(document.DeletedAt)
}

func (suite *ResolverSuite) TestPlanDocumentCreateOtherType() {
	plan := suite.createModelPlan("Plan with Documents")

	reader := bytes.NewReader([]byte("Some test file contents"))

	otherTypeDescription := "Dog Document (A document about a dog)"
	optionalNotes := "The dog's name is mortimer. Keep that in mind while reading"

	input := &model.PlanDocumentInput{
		ModelPlanID: plan.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "sample.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		Restricted:           true,
		DocumentType:         models.DocumentTypeOther,
		OtherTypeDescription: &otherTypeDescription,
		OptionalNotes:        &optionalNotes,
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
	suite.True(document.Restricted)
	suite.EqualValues(models.DocumentTypeOther, document.DocumentType)
	suite.EqualValues(otherTypeDescription, document.OtherTypeDescription.String)
	suite.EqualValues(optionalNotes, document.OptionalNotes.String)
	suite.Nil(document.DeletedAt)
}
