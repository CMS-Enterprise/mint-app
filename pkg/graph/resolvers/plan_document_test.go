package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	_ "github.com/lib/pq" // required for postgres driver in sql
)

func createDummyPlanDocument(plan *models.ModelPlan) models.PlanDocument {
	fakeString := "FAKE"
	input := models.PlanDocument{
		ID:           uuid.Nil,
		ModelPlanID:  plan.ID,
		FileType:     &fakeString,
		Bucket:       &fakeString,
		FileKey:      &fakeString,
		VirusScanned: false,
		VirusClean:   false,
		FileName:     &fakeString,
		FileSize:     0,
		DocumentType: &fakeString,
		OtherType:    &fakeString,
		DeletedAt:    nil,
		CreatedBy:    &fakeString,
		CreatedDts:   nil,
		ModifiedBy:   &fakeString,
		ModifiedDts:  nil,
		Status:       "",
	}
	return input
}

func createFakeDependencies(t *testing.T) (*zap.Logger, string, *storage.Store, error) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	principal := "FAKE"

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)
	return logger, principal, store, err
}

func TestPlanDocumentCreate(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := models.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocument(plan)
	document, err := PlanDocumentCreate(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.NotNil(t, document)
	assert.Equal(t, plan.ID, document.ModelPlanID)

	store.PlanDocumentDelete(logger, document.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

func TestPlanDocumentRead(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := models.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocument(plan)

	document, err := PlanDocumentCreate(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.NotNil(t, document)
	assert.Equal(t, plan.ID, document.ModelPlanID)

	fetchedPlanDocument, err := PlanDocumentRead(logger, document.ID, store)
	assert.NoError(t, err)
	assert.NotNil(t, fetchedPlanDocument)
	assert.Equal(t, document.ID, fetchedPlanDocument.ID)
	assert.Equal(t, document.ModelPlanID, fetchedPlanDocument.ModelPlanID)

	store.PlanDocumentDelete(logger, fetchedPlanDocument.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

func TestPlanDocumentReadByModelPlanID(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := models.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocument(plan)

	document, err := PlanDocumentCreate(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.NotNil(t, document)
	assert.Equal(t, plan.ID, document.ModelPlanID)

	fetchedPlanDocument, err := PlanDocumentReadByModelPlanID(logger, document.ModelPlanID, store)
	assert.NoError(t, err)
	assert.NotNil(t, fetchedPlanDocument)
	assert.Equal(t, document.ID, fetchedPlanDocument.ID)
	assert.Equal(t, document.ModelPlanID, fetchedPlanDocument.ModelPlanID)

	store.PlanDocumentDelete(logger, fetchedPlanDocument.ID)
	store.ModelPlanDeleteByID(logger, plan.ID)
}

// TODO: How do we want to handle updating?
func TestPlanDocumentUpdate(t *testing.T) {
	assert.FailNow(t, "not implemented")
}

func TestPlanDocumentDelete(t *testing.T) {
	logger, principal, store, err := createFakeDependencies(t)
	assert.NoError(t, err)

	modelName := "FAKE"
	planTemplate := models.ModelPlan{ModelName: &modelName}
	plan, err := ModelPlanCreate(logger, &planTemplate, store)
	assert.NoError(t, err)

	input := createDummyPlanDocument(plan)

	document, err := PlanDocumentCreate(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.NotNil(t, document)
	assert.Equal(t, plan.ID, document.ModelPlanID)

	rowsDeleted, err := PlanDocumentDelete(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.Equal(t, 1, rowsDeleted)

	store.ModelPlanDeleteByID(logger, plan.ID)
}
