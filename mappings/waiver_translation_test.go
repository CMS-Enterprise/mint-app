package mappings

import (
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestWaiverTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(
		t,
		WaiverTranslation,
		models.Waiver{},
		append(taskListStructExcludeFields, "CommonWaiverID", "WillUseWaiver"),
	)
}
