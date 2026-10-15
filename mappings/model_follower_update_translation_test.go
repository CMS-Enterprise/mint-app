package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestModelFollowerUpdateTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, ModelFollowerUpdateTranslation, models.ModelFollowerUpdate{}, taskListStructExcludeFields)
}
