package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanBeneficiariesTranslation(t *testing.T) {
	translation, err := PlanBeneficiariesTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)
	//TODO: (ChChCh Changes!) Need to assert that each field actually has the value, if it doesn't map up, it will show just 0 values
}
