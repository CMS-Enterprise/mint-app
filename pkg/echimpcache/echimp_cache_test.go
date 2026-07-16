package echimpcache

import (
	"context"
	"fmt"
	"os"
	"strings"
	"sync"
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

	client := newECHIMPTestClient(t)
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

func newECHIMPTestClient(t *testing.T) *s3.S3Client {
	t.Helper()

	requiredEnvKeys := []string{
		appconfig.AWSRegion,
		appconfig.AWSS3ECHIMPBucket,
		appconfig.LocalMinioAddressKey,
		appconfig.LocalMinioS3AccessKey,
		appconfig.LocalMinioS3SecretKey,
	}

	missingEnvKeys := make([]string, 0, len(requiredEnvKeys))
	viperConfig := viper.New()
	for _, key := range requiredEnvKeys {
		value, exists := os.LookupEnv(key)
		if !exists || value == "" {
			missingEnvKeys = append(missingEnvKeys, key)
			continue
		}
		viperConfig.Set(key, value)
	}

	if len(missingEnvKeys) > 0 {
		t.Skipf("skipping ECHIMP integration test; missing env: %s", strings.Join(missingEnvKeys, ", "))
	}

	return s3testconfigs.S3TestECHIMPClient(viperConfig)
}

func resetECHIMPCache(t *testing.T) {
	t.Helper()

	CRAndTDLCache = nil
	crAndTDLCacheOnce = sync.Once{}
	t.Cleanup(func() {
		CRAndTDLCache = nil
		crAndTDLCacheOnce = sync.Once{}
	})
}
