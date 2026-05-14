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

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

func TestRefreshCacheRetriesOnceAfterExpiredCredentials(t *testing.T) {
	t.Setenv(appconfig.LocalMinioAddressKey, "http://localhost:9000")
	t.Setenv(appconfig.LocalMinioS3AccessKey, "test-access-key")
	t.Setenv(appconfig.LocalMinioS3SecretKey, "test-secret-key")

	client := s3.NewS3ClientUsingClient(nil, s3.Config{
		Bucket:  "test-bucket",
		Region:  "us-west-2",
		IsLocal: true,
	})

	modelID := uuid.New()
	readCalls := 0

	readFn := func(_ *s3.S3Client, crKey string, tdlKey string) ([]*models.EChimpCRRaw, []*models.EChimpTDLRaw, error) {
		readCalls++
		if readCalls == 1 {
			return nil, nil, &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		assert.Equal(t, "cr-file.parquet", crKey)
		assert.Equal(t, "tdl-file.parquet", tdlKey)

		return []*models.EChimpCRRaw{
				{
					CrNumber:            "CR-1",
					VersionNum:          "1",
					CrSummary:           "Summary",
					AssociatedModelUids: modelID.String(),
				},
			}, []*models.EChimpTDLRaw{
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

	err := cache.refreshCacheWithReader(context.Background(), client, viperConfig, zap.NewNop(), readFn)

	require.NoError(t, err)
	assert.Equal(t, 2, readCalls)
	assert.Len(t, cache.CRs, 1)
	assert.Len(t, cache.TDls, 1)
	assert.Len(t, cache.CrsAndTDLsByModelPlanID[modelID], 2)
	assert.False(t, cache.lastChecked.Before(before))
}
