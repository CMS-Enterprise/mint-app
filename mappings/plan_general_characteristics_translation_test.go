package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanGeneralCharacteristicsTranslation(t *testing.T) {
	translation, err := PlanGeneralCharacteristicsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

}
