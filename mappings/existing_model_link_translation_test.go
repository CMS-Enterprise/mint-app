package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestExistingModelLinkTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, ExistingModelLinkTranslation, models.ExistingModelLink{}, taskListStructExcludeFields)
}
