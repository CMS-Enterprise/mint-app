package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOCommonSolutionContractorTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOCommonSolutionContractorTranslation, models.MTOCommonSolutionContractor{}, baseStructExcludeFields)
}
