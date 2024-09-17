package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestParticipantsAndProvidersTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanParticipantsAndProvidersTranslation, models.PlanParticipantsAndProviders{}, taskListStructExcludeFields)
}
