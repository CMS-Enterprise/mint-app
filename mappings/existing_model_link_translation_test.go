package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestExistingModelLinkTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, ExistingModelLinkTranslation, models.ExistingModelLink{}, taskListStructExcludeFields)
}
