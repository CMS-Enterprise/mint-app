package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestDiscussionReplyTranslation(t *testing.T) {
	translation, err := DiscussionReplyTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestDiscussionReplyTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := DiscussionReplyTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestDiscussionReplyTranslationFieldCoverage(t *testing.T) {
	translation, err := DiscussionReplyTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assertTranslationStructCoverage(t, tMap, models.PlanDiscussion{}, taskListStructExcludeFields)
}
