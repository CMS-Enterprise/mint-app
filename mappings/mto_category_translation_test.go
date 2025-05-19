package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOCategoryTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOCategoryTranslation, models.MTOCategory{}, taskListStructExcludeFields)
}
