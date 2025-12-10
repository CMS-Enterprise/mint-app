package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestKeyContactTranslation(t *testing.T) {
	excludedFields := append(baseStructExcludeFields, "Name", "Email")
	assertAllTranslationDataGeneric(t, KeyContactTranslation, models.KeyContact{}, excludedFields)
}
