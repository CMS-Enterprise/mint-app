package echimpcache

import (
	"bytes"
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/parquet-go/parquet-go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestGetECHIMPCrAndTDLCacheLogsMissingCRKey(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient(t)
	viperConfig := newECHIMPTestConfig(t)

	err := echimptestdata.SeedTDLTestData(
		client,
		viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName),
	)
	require.NoError(t, err)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache, err := GetECHIMPCrAndTDLCache(context.Background(), client, viperConfig, logger)
	require.NoError(t, err)
	require.NotNil(t, cache)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP CR data", entries[0].Message)
	assert.Equal(t, viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName), entries[0].ContextMap()["key"])
}

func TestGetECHIMPCrAndTDLCacheLogsMissingTDLKey(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient(t)
	viperConfig := newECHIMPTestConfig(t)

	err := echimptestdata.SeedCRTestData(
		client,
		viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName),
	)
	require.NoError(t, err)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache, err := GetECHIMPCrAndTDLCache(context.Background(), client, viperConfig, logger)
	require.NoError(t, err)
	require.NotNil(t, cache)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP TDL data", entries[0].Message)
	assert.Equal(t, viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName), entries[0].ContextMap()["key"])
}

func TestGetECHIMPCrAndTDLCacheReturnsCRParseErrorBeforeMissingTDL(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient(t)
	viperConfig := newECHIMPTestConfig(t)

	var crBuffer bytes.Buffer
	writeErr := parquet.Write(&crBuffer, []models.EChimpCRRaw{
		{
			CrNumber:            "CR-1",
			VersionNum:          "1",
			CrSummary:           "Summary",
			AssociatedModelUids: "not-a-uuid",
		},
	})
	require.NoError(t, writeErr)

	err := client.UploadFile(
		context.Background(),
		bytes.NewReader(crBuffer.Bytes()),
		viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName),
	)
	require.NoError(t, err)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache, err := GetECHIMPCrAndTDLCache(context.Background(), client, viperConfig, logger)
	require.Error(t, err)
	require.NotNil(t, cache)

	assert.ErrorContains(t, err, "invalid UUID")

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "error refreshing ECHIMP CR and TDL cache", entries[0].Message)
}

func TestRefreshCacheDoesNotPartiallyOverwriteExistingDataWhenTDLIsMissing(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient(t)
	viperConfig := newECHIMPTestConfig(t)

	err := echimptestdata.SeedCRTestData(
		client,
		viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName),
	)
	require.NoError(t, err)

	existingModelPlanID := uuid.New()
	existingCR := &models.EChimpCR{CrNumber: "existing-cr"}
	existingTDL := &models.EChimpTDL{TdlNumber: "existing-tdl"}
	existingCombined := []models.EChimpCRAndTDLS{existingCR, existingTDL}
	existingLastChecked := time.Now().Add(-time.Hour)

	cache := &crAndTDLCache{
		lastChecked:   existingLastChecked,
		CRs:           []*models.EChimpCR{existingCR},
		TDls:          []*models.EChimpTDL{existingTDL},
		AllCrsAndTDLs: existingCombined,
		CRsByModelPlanID: map[uuid.UUID][]*models.EChimpCR{
			existingModelPlanID: {existingCR},
		},
		TDLsByModelPlanID: map[uuid.UUID][]*models.EChimpTDL{
			existingModelPlanID: {existingTDL},
		},
		CrsAndTDLsByModelPlanID: map[uuid.UUID][]models.EChimpCRAndTDLS{
			existingModelPlanID: existingCombined,
		},
		CRByCRNumber:    map[string]*models.EChimpCR{"existing-cr": existingCR},
		TDLsByTDLNumber: map[string]*models.EChimpTDL{"existing-tdl": existingTDL},
	}

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	err = cache.refreshCache(context.Background(), client, viperConfig, logger)
	require.NoError(t, err)

	assert.Equal(t, existingLastChecked, cache.lastChecked)
	assert.Equal(t, []*models.EChimpCR{existingCR}, cache.CRs)
	assert.Equal(t, []*models.EChimpTDL{existingTDL}, cache.TDls)
	assert.Equal(t, existingCombined, cache.AllCrsAndTDLs)
	assert.Equal(t, map[uuid.UUID][]*models.EChimpCR{existingModelPlanID: {existingCR}}, cache.CRsByModelPlanID)
	assert.Equal(t, map[uuid.UUID][]*models.EChimpTDL{existingModelPlanID: {existingTDL}}, cache.TDLsByModelPlanID)
	assert.Equal(t, map[uuid.UUID][]models.EChimpCRAndTDLS{existingModelPlanID: existingCombined}, cache.CrsAndTDLsByModelPlanID)
	assert.Equal(t, map[string]*models.EChimpCR{"existing-cr": existingCR}, cache.CRByCRNumber)
	assert.Equal(t, map[string]*models.EChimpTDL{"existing-tdl": existingTDL}, cache.TDLsByTDLNumber)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP TDL data", entries[0].Message)
}
