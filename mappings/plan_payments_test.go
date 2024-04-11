package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanPaymentsTranslation(t *testing.T) {
	translation, err := PlanPaymentsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

}
