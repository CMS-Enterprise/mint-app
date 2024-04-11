package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanCollaboratorsTranslation(t *testing.T) {
	translation, err := PlanCollaboratorsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

}
