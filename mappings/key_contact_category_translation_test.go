package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestKeyContactCategoryTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, KeyContactCategoryTranslation, models.KeyContactCategory{}, baseStructExcludeFields)
}
