package echimpcache

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
)

func TestGetECHIMPCrAndTDLCacheLogsMissingCRKey(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient()
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

	client := newECHIMPTestClient()
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
