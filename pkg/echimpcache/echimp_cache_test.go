package echimpcache

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
	"github.com/cms-enterprise/mint-app/pkg/testconfig"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

func TestGetECHIMPCrAndTDLCache(t *testing.T) {
	config := testconfig.GetDefaultTestConfigs(useraccountstoretestconfigs.GetTestPrincipal)

	assert := assert.New(t)
	assert.NotNil(config)
	err := echimptestdata.SeedEChimpTestData(config.EChimpS3Client)
	assert.NoError(err)

	cache, err := GetECHIMPCrAndTDLCache(config.EChimpS3Client)
	assert.NotNil(cache)
	assert.NoError(err)

}
