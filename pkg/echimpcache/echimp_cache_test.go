package echimpcache

import (
	"context"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/s3testconfigs"
)

func TestGetECHIMPCrAndTDLCache(t *testing.T) {
	resetECHIMPCache(t)

	client := newECHIMPTestClient()
	viperConf := newECHIMPTestConfig(t)

	err := echimptestdata.SeedEChimpTestData(client, viperConf)
	require.NoError(t, err)

	cache, err := GetECHIMPCrAndTDLCache(context.Background(), client, viperConf, zap.NewNop())
	require.NoError(t, err)
	require.NotNil(t, cache)

	assert.NotEmpty(t, cache.CRs)
	assert.NotEmpty(t, cache.TDls)
	assert.NotEmpty(t, cache.AllCrsAndTDLs)
	assert.False(t, cache.lastChecked.IsZero())
}

func newECHIMPTestConfig(t *testing.T) *viper.Viper {
	t.Helper()

	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCRFileName, uniqueECHIMPKey(t, "cr"))
	viperConfig.Set(appconfig.AWSS3ECHIMPTDLFileName, uniqueECHIMPKey(t, "tdl"))
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 0)

	return viperConfig
}

func uniqueECHIMPKey(t *testing.T, prefix string) string {
	t.Helper()

	testName := strings.ReplaceAll(strings.ToLower(t.Name()), "/", "-")
	return fmt.Sprintf("testdata/%s-%s-%s.parquet", testName, prefix, uuid.NewString())
}

func newECHIMPTestClient() *s3.S3Client {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSRegion, envOrDefault(appconfig.AWSRegion, "us-west-2"))
	viperConfig.Set(appconfig.AWSS3ECHIMPBucket, envOrDefault(appconfig.AWSS3ECHIMPBucket, "mint-app-echimp-uploads"))
	viperConfig.Set(appconfig.LocalMinioAddressKey, envOrDefault(appconfig.LocalMinioAddressKey, "http://localhost:9005"))
	viperConfig.Set(appconfig.LocalMinioS3AccessKey, envOrDefault(appconfig.LocalMinioS3AccessKey, "minioadmin"))
	viperConfig.Set(appconfig.LocalMinioS3SecretKey, envOrDefault(appconfig.LocalMinioS3SecretKey, "minioadmin"))

	return s3testconfigs.S3TestECHIMPClient(viperConfig)
}

func envOrDefault(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}

func resetECHIMPCache(t *testing.T) {
	t.Helper()

	CRAndTDLCache = nil
	t.Cleanup(func() {
		CRAndTDLCache = nil
	})
}
