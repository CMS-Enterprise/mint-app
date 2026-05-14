package echimpcache

import (
	"context"
	"testing"
	"time"

	"github.com/aws/smithy-go"
	"github.com/google/uuid"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

type refreshTestContextKey string

func TestRefreshCacheWithReaderPopulatesCache(t *testing.T) {
	client := s3.NewS3ClientUsingClient(nil, s3.Config{})

	modelID := uuid.New()
	readCRCalls := 0
	readTDLCalls := 0
	ctx := context.WithValue(context.Background(), refreshTestContextKey("test-key"), "test-value")

	readCRFn := func(callCtx context.Context, _ *s3.S3Client, key string) ([]*models.EChimpCRRaw, error) {
		readCRCalls++
		assert.Equal(t, "test-value", callCtx.Value(refreshTestContextKey("test-key")))
		assert.Equal(t, "cr-file.parquet", key)

		return []*models.EChimpCRRaw{
			{
				CrNumber:            "CR-1",
				VersionNum:          "1",
				CrSummary:           "Summary",
				AssociatedModelUids: modelID.String(),
			},
		}, nil
	}

	readTDLFn := func(callCtx context.Context, _ *s3.S3Client, key string) ([]*models.EChimpTDLRaw, error) {
		readTDLCalls++
		assert.Equal(t, "test-value", callCtx.Value(refreshTestContextKey("test-key")))
		assert.Equal(t, "tdl-file.parquet", key)

		return []*models.EChimpTDLRaw{
			{
				TdlNumber:           "TDL-1",
				VersionNum:          "1",
				Title:               "Title",
				AssociatedModelUids: modelID.String(),
			},
		}, nil
	}

	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCRFileName, "cr-file.parquet")
	viperConfig.Set(appconfig.AWSS3ECHIMPTDLFileName, "tdl-file.parquet")

	cache := &crAndTDLCache{}
	before := time.Now()

	err := cache.refreshCacheWithReaders(ctx, client, viperConfig, zap.NewNop(), readCRFn, readTDLFn)

	require.NoError(t, err)
	assert.Equal(t, 1, readCRCalls)
	assert.Equal(t, 1, readTDLCalls)
	assert.Len(t, cache.CRs, 1)
	assert.Len(t, cache.TDls, 1)
	assert.Len(t, cache.CrsAndTDLsByModelPlanID[modelID], 2)
	assert.False(t, cache.lastChecked.Before(before))
}

func TestRefreshCacheWithReadersLogsMissingCRKey(t *testing.T) {
	client := s3.NewS3ClientUsingClient(nil, s3.Config{})
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCRFileName, "missing-cr.parquet")
	viperConfig.Set(appconfig.AWSS3ECHIMPTDLFileName, "tdl-file.parquet")

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache := &crAndTDLCache{}
	err := cache.refreshCacheWithReaders(
		context.Background(),
		client,
		viperConfig,
		logger,
		func(context.Context, *s3.S3Client, string) ([]*models.EChimpCRRaw, error) {
			return nil, &smithy.GenericAPIError{Code: "NoSuchKey", Message: "missing cr"}
		},
		func(context.Context, *s3.S3Client, string) ([]*models.EChimpTDLRaw, error) {
			t.Fatal("TDL reader should not run when the CR file is missing")
			return nil, nil
		},
	)

	require.NoError(t, err)
	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP CR data", entries[0].Message)
	assert.Equal(t, "missing-cr.parquet", entries[0].ContextMap()["key"])
}

func TestRefreshCacheWithReadersLogsMissingTDLKey(t *testing.T) {
	client := s3.NewS3ClientUsingClient(nil, s3.Config{})
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCRFileName, "cr-file.parquet")
	viperConfig.Set(appconfig.AWSS3ECHIMPTDLFileName, "missing-tdl.parquet")

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache := &crAndTDLCache{}
	err := cache.refreshCacheWithReaders(
		context.Background(),
		client,
		viperConfig,
		logger,
		func(context.Context, *s3.S3Client, string) ([]*models.EChimpCRRaw, error) {
			return []*models.EChimpCRRaw{}, nil
		},
		func(context.Context, *s3.S3Client, string) ([]*models.EChimpTDLRaw, error) {
			return nil, &smithy.GenericAPIError{Code: "NoSuchKey", Message: "missing tdl"}
		},
	)

	require.NoError(t, err)
	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "file not found for ECHIMP TDL data", entries[0].Message)
	assert.Equal(t, "missing-tdl.parquet", entries[0].ContextMap()["key"])
}
