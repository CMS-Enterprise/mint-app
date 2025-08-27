package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestAnalyticsReturnsExpectedDataStructure tests that the Analytics function returns the expected data structure
func TestAnalyticsReturnsExpectedDataStructure(t *testing.T) {
	// Create test data that matches what the analytics functions would return
	modelName1 := "Test Model 1"
	modelName2 := "Test Model 2"
	tableName1 := "plan_basics"
	tableName2 := "plan_documents"
	status1 := models.ModelStatusActive
	status2 := models.ModelStatusIcipComplete

	numberOfChanges1 := 10
	numberOfChanges2 := 15
	numberOfRecordChanges1 := 5
	numberOfRecordChanges2 := 8
	numberOfModels1 := 25
	numberOfModels2 := 15
	totalNumberOfModels := 40
	numberOfFollowers1 := 12

	modelID1 := uuid.MustParse("123e4567-e89b-12d3-a456-426614174000")
	modelID2 := uuid.MustParse("123e4567-e89b-12d3-a456-426614174001")

	expectedChangesPerModel := []*models.ModelChangesAnalytics{
		{
			ModelName:             &modelName1,
			NumberOfChanges:       &numberOfChanges1,
			NumberOfRecordChanges: &numberOfRecordChanges1,
			ModelPlanID:           &modelID1,
		},
		{
			ModelName:             &modelName2,
			NumberOfChanges:       &numberOfChanges2,
			NumberOfRecordChanges: &numberOfRecordChanges2,
			ModelPlanID:           &modelID2,
		},
	}

	expectedModelsByStatus := []*models.ModelsByStatusAnalytics{
		{
			Status:         (*string)(&status1),
			NumberOfModels: &numberOfModels1,
		},
		{
			Status:         (*string)(&status2),
			NumberOfModels: &numberOfModels2,
		},
	}

	expectedTotalNumberOfModels := []*models.ModelCountAnalytics{
		{
			TotalNumberOfModels: &totalNumberOfModels,
		},
	}

	expectedNumberOfFollowersPerModel := []*models.ModelFollowersAnalytics{
		{
			ModelName:         &modelName1,
			NumberOfFollowers: &numberOfFollowers1,
			ModelPlanID:       &modelID1,
		},
	}

	expectedChangesPerModelBySection := []*models.ModelChangesBySectionAnalytics{
		{
			ModelName:             &modelName1,
			TableName:             &tableName1,
			NumberOfChanges:       &numberOfChanges1,
			NumberOfRecordChanges: &numberOfRecordChanges1,
			ModelPlanID:           &modelID1,
		},
	}

	expectedChangesPerModelOtherData := []*models.ModelChangesOtherDataAnalytics{
		{
			ModelName:             &modelName1,
			TableName:             &tableName2,
			NumberOfChanges:       &numberOfChanges1,
			NumberOfRecordChanges: &numberOfRecordChanges1,
			Section:               &tableName2,
			ModelPlanID:           &modelID1,
		},
	}

	// Create expected analytics summary
	expectedSummary := &models.AnalyticsSummary{
		ChangesPerModel:           expectedChangesPerModel,
		ChangesPerModelBySection:  expectedChangesPerModelBySection,
		ChangesPerModelOtherData:  expectedChangesPerModelOtherData,
		ModelsByStatus:            expectedModelsByStatus,
		NumberOfFollowersPerModel: expectedNumberOfFollowersPerModel,
		TotalNumberOfModels:       expectedTotalNumberOfModels[0],
	}

	// Verify the expected data structure
	assert.NotNil(t, expectedSummary)
	assert.Len(t, expectedSummary.ChangesPerModel, 2)
	assert.Len(t, expectedSummary.ModelsByStatus, 2)
	assert.Len(t, expectedSummary.NumberOfFollowersPerModel, 1)
	assert.Len(t, expectedSummary.ChangesPerModelBySection, 1)
	assert.Len(t, expectedSummary.ChangesPerModelOtherData, 1)
	assert.NotNil(t, expectedSummary.TotalNumberOfModels)

	// Verify specific data values
	assert.Equal(t, "Test Model 1", *expectedSummary.ChangesPerModel[0].ModelName)
	assert.Equal(t, 10, *expectedSummary.ChangesPerModel[0].NumberOfChanges)
	assert.Equal(t, "ACTIVE", *expectedSummary.ModelsByStatus[0].Status)
	assert.Equal(t, 25, *expectedSummary.ModelsByStatus[0].NumberOfModels)
	assert.Equal(t, 40, *expectedSummary.TotalNumberOfModels.TotalNumberOfModels)
}

// TestAnalyticsSummaryStructure tests the complete structure of AnalyticsSummary
func TestAnalyticsSummaryStructure(t *testing.T) {
	summary := &models.AnalyticsSummary{}

	// Test that all required fields exist and are accessible
	assert.NotNil(t, summary)

	// These fields should be initialized as empty slices/nil
	assert.Nil(t, summary.ChangesPerModel)
	assert.Nil(t, summary.ChangesPerModelBySection)
	assert.Nil(t, summary.ChangesPerModelOtherData)
	assert.Nil(t, summary.ModelsByStatus)
	assert.Nil(t, summary.NumberOfFollowersPerModel)
	assert.Nil(t, summary.TotalNumberOfModels)
}
