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

// TestGetECHIMPCrAndTDLCacheSkipsInvalidCRRecordAndStillLoadsValidData is the regression test for
// the ECHIMP cache resilience fix: ECHIMP is a third-party data export MINT doesn't control the
// quality of, so a single malformed record (here, a CR with an AssociatedModelUids that isn't a
// valid UUID) must not take down the whole cache refresh. Before this fix, one bad CR anywhere in
// the batch caused GetECHIMPCrAndTDLCache to error out entirely - valid CRs, and TDLs, included.
func TestGetECHIMPCrAndTDLCacheSkipsInvalidCRRecordAndStillLoadsValidData(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient(t)
	viperConfig := newECHIMPTestConfig(t)

	var crBuffer bytes.Buffer
	writeErr := parquet.Write(&crBuffer, []models.EChimpCRRaw{
		{
			CrNumber:            "CR-GOOD",
			VersionNum:          "1",
			CrSummary:           "Summary",
			AssociatedModelUids: "11111111-1111-1111-1111-111111111111",
		},
		{
			CrNumber:            "CR-BAD",
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

	tdlErr := echimptestdata.SeedTDLTestData(
		client,
		viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName),
	)
	require.NoError(t, tdlErr)

	core, logs := observer.New(zap.WarnLevel)
	logger := zap.New(core)

	cache, err := GetECHIMPCrAndTDLCache(context.Background(), client, viperConfig, logger)
	require.NoError(t, err)
	require.NotNil(t, cache)

	// The bad CR is dropped; the good one, and the (unrelated) valid TDL data, still load.
	require.Len(t, cache.crs, 1)
	assert.Equal(t, "CR-GOOD", cache.crs[0].CrNumber)
	assert.NotEmpty(t, cache.tdls)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "skipping invalid ECHIMP CR record", entries[0].Message)
	assert.Contains(t, entries[0].ContextMap()["error"], "CR-BAD")
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
		crs:           []*models.EChimpCR{existingCR},
		tdls:          []*models.EChimpTDL{existingTDL},
		allCrsAndTDLs: existingCombined,
		crsByModelPlanID: map[uuid.UUID][]*models.EChimpCR{
			existingModelPlanID: {existingCR},
		},
		tdlsByModelPlanID: map[uuid.UUID][]*models.EChimpTDL{
			existingModelPlanID: {existingTDL},
		},
		crsAndTDLsByModelPlanID: map[uuid.UUID][]models.EChimpCRAndTDLS{
			existingModelPlanID: existingCombined,
		},
		crByCRNumber:    map[string]*models.EChimpCR{"existing-cr": existingCR},
		tdlsByTDLNumber: map[string]*models.EChimpTDL{"existing-tdl": existingTDL},
	}

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	err = cache.refreshCache(context.Background(), client, viperConfig, logger)
	require.NoError(t, err)

	assert.Equal(t, existingLastChecked, cache.lastChecked)
	assert.Equal(t, []*models.EChimpCR{existingCR}, cache.crs)
	assert.Equal(t, []*models.EChimpTDL{existingTDL}, cache.tdls)
	assert.Equal(t, existingCombined, cache.allCrsAndTDLs)
	assert.Equal(t, map[uuid.UUID][]*models.EChimpCR{existingModelPlanID: {existingCR}}, cache.crsByModelPlanID)
	assert.Equal(t, map[uuid.UUID][]*models.EChimpTDL{existingModelPlanID: {existingTDL}}, cache.tdlsByModelPlanID)
	assert.Equal(t, map[uuid.UUID][]models.EChimpCRAndTDLS{existingModelPlanID: existingCombined}, cache.crsAndTDLsByModelPlanID)
	assert.Equal(t, map[string]*models.EChimpCR{"existing-cr": existingCR}, cache.crByCRNumber)
	assert.Equal(t, map[string]*models.EChimpTDL{"existing-tdl": existingTDL}, cache.tdlsByTDLNumber)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP TDL data", entries[0].Message)
}
