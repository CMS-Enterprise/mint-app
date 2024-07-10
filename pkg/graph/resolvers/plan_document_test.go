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

	suite.Run("Invalid urls will cause an error", func() {
		input.URL = "Hello"

		_, err = PlanDocumentCreateLinked(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.Error(err)
	})

	suite.Run("urls with no protocol cause an error", func() {
		input.URL = "www.google.com"

		_, err = PlanDocumentCreateLinked(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.Error(err)
	})

	suite.Run("urls non http/https protocol cause an error", func() {
		input.URL = "ws://www.google.com"

		_, err = PlanDocumentCreateLinked(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.Error(err)
	})
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

func (suite *ResolverSuite) TestCollaboratorNonCMSCannotSeeRestrictedDocs() {
	plan := suite.createModelPlan("Plan with Documents")

	reader := bytes.NewReader([]byte("Some test file contents"))

	restrictedDocInput := &model.PlanDocumentInput{
		ModelPlanID: plan.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "restricted.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		Restricted:   true,
		DocumentType: models.DocumentTypeConceptPaper,
		// OtherTypeDescription is nil
		// OptionalNotes is nil
	}
	_, err := PlanDocumentCreate(suite.testConfigs.Logger, restrictedDocInput, suite.testConfigs.Principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
	suite.NoError(err)

	unRestrictedDocInput := &model.PlanDocumentInput{
		ModelPlanID: plan.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "unrestricted.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		Restricted:   false,
		DocumentType: models.DocumentTypeConceptPaper,
		// OtherTypeDescription is nil
		// OptionalNotes is nil
	}
	unRestrictedDoc, err := PlanDocumentCreate(suite.testConfigs.Logger, unRestrictedDocInput, suite.testConfigs.Principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
	suite.NoError(err)

	// "TEST", by default (from testConfigs defaults) is the creator of the model plan, and is, therefore, already a collaborator
	// So we don't need to make one!

	// create a principal for "TEST" that DOESN'T have the non-CMS job code -- they SHOULD be able to see both docs
	principal := suite.getTestPrincipal(suite.testConfigs.Store, "TEST")
	docs, err := PlanDocumentsReadByModelPlanID(suite.testConfigs.Logger, plan.ID, principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
	suite.NoError(err)
	suite.Len(docs, 2)

	// modify the principal for "TEST" so that it DOES have the non-CMS job code -- they now SHOULD NOT be able to see both docs (only the non-restricted one)
	principal.JobCodeNonCMS = true
	docs, err = PlanDocumentsReadByModelPlanID(suite.testConfigs.Logger, plan.ID, principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
	suite.NoError(err)
	suite.Len(docs, 1)
	suite.Equal(docs[0].ID, unRestrictedDoc.ID)
}
