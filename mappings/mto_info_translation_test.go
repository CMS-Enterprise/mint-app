package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOInfoTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOInfoTranslation, models.MTOInfo{}, taskListStructExcludeFields)
}
