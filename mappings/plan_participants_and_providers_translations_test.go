package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParticipantsAndProvidersTranslation(t *testing.T) {
	translation, err := ParticipantsAndProvidersTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

}
