package resolvers

/*import (
	"github.csom/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/upload"
	"testing"

	"github.com/cmsgov/mint-app/pkg/modelSections"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	_ "github.com/lib/pq" // required for postgres driver in sql
)

func createDummyPlanDocumentInput(plan *modelSections.ModelPlan) model.PlanDocumentInput {
	fakeString := "FAKE"
	url := "http://localhost:9050/mint-test-bucket/e9eb4a4f-9100-416f-be5b-f141bb436cfa.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&"
	input := model.PlanDocumentInput{
		ID:          nil,
		ModelPlanID: plan.ID,
		DocumentParameters: &model.PlanDocumentParameters{
			FileType:     nil,
			DocumentType: &fakeString,
			OtherTypeDescription:    nil,
		},
		URL: &url,
	}

	return input
}

func createFakeDependencies(t *testing.T) (*zap.Logger, string, *storage.Store, *upload.S3Client, error) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	principal := "FAKE"

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)

	s3Client := createS3Client()

	return logger, principal, store, &s3Client, err
}

func createS3Client(store *storage.Store) upload.S3Client {
	s3Config := s.NewS3Config()
	if s.environment.Local() || s.environment.Test() {
		s3Config.IsLocal = true
	}

	s3Client := upload.NewS3Client(s3Config)
	return s3Client
}

/*func TestPlanDocumentCreate(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := modelSections.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocumentInput(plan)
	documentPayload, err := PlanDocumentCreate(logger, &input, &principal, store, nil)
	assert.NoError(t, err)
	assert.NotNil(t, documentPayload)
	assert.Equal(t, plan.ID, documentPayload.Document.ModelPlanID)

	store.PlanDocumentDelete(logger, documentPayload.Document.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

func TestPlanDocumentRead(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := modelSections.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocumentInput(plan)

	documentPayload, err := PlanDocumentCreate(logger, &input, &principal, store, nil)
	assert.NoError(t, err)
	assert.NotNil(t, documentPayload)
	assert.NotNil(t, documentPayload.Document)
	assert.Equal(t, plan.ID, documentPayload.Document.ModelPlanID)

	fetchedPlanDocument, err := PlanDocumentRead(logger, documentPayload.Document.ID, store)
	assert.NoError(t, err)
	assert.NotNil(t, fetchedPlanDocument)
	assert.Equal(t, documentPayload.Document.ID, fetchedPlanDocument.ID)
	assert.Equal(t, documentPayload.Document.ModelPlanID, fetchedPlanDocument.ModelPlanID)

	store.PlanDocumentDelete(logger, fetchedPlanDocument.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

func TestPlanDocumentsReadByModelPlanID(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	// set up S3 client
	s3Client := createS3Client()

	modelName := "FAKE"
	planTemplate := modelSections.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocumentInput(plan)
	documentA := validatedCreatePlanDocumentPayload(t, logger, input, principal, store, plan.ID)
	documentB := validatedCreatePlanDocumentPayload(t, logger, input, principal, store, plan.ID)

	fetchedPlanDocuments, err := PlanDocumentsReadByModelPlanID(logger, plan.ID, store, &s3Client)
	assert.NoError(t, err)
	assert.NotNil(t, fetchedPlanDocuments)
	assert.Contains(t, fetchedPlanDocuments, documentA)
	assert.Contains(t, fetchedPlanDocuments, documentB)

	store.PlanDocumentDelete(logger, documentB.Document.ID)
	store.PlanDocumentDelete(logger, documentA.Document.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

func validatedCreatePlanDocumentPayload(t *testing.T, logger *zap.Logger, input model.PlanDocumentInput, principal string, store *storage.Store, planID uuid.UUID) *model.PlanDocumentPayload {
	documentPayload, err := PlanDocumentCreate(logger, &input, &principal, store, nil)
	assert.NoError(t, err)
	assert.NotNil(t, documentPayload)
	assert.NotNil(t, documentPayload.Document)
	assert.Equal(t, planID, documentPayload.Document.ModelPlanID)
	return documentPayload
}

// TODO: How do we want to handle updating?
func TestPlanDocumentUpdate(t *testing.T) {
	assert.FailNow(t, "not implemented")
}

func TestPlanDocumentDelete(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := modelSections.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocumentInput(plan)

	document, err := PlanDocumentCreate(logger, &input, &principal, store, nil)
	assert.NoError(t, err)
	assert.NotNil(t, document)
	assert.Equal(t, plan.ID, document.ModelPlanID)

	rowsDeleted, err := PlanDocumentDelete(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.Equal(t, 1, rowsDeleted)

	store.ModelPlanDeleteByID(logger, plan.ID)
}*/
