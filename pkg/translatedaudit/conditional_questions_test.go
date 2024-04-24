package translatedaudit

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

// TestCheckChildConditionals verifies the conditional question logic
func TestCheckChildConditionals(t *testing.T) {
	childMap := testChildMap()

	var old string
	var new string
	t.Run("Nil old means no conditionals", func(t *testing.T) {
		conditionals := checkChildConditionals(old, new, childMap)
		assert.Nil(t, conditionals)
	})

	t.Run("Old with children to nil means show all", func(t *testing.T) {
		old = "answer1"
		conditionals := checkChildConditionals(old, new, childMap)
		assert.NotNil(t, conditionals)
		children := childMap[old]

		if conditionals != nil {

			assert.Contains(t, *conditionals, children[0].Label)
			assert.Contains(t, *conditionals, children[1].Label)
		}

	})

	t.Run("Old with children to overlap means show all that don't overlap", func(t *testing.T) {
		old = "answer1"
		new = "answer2"
		conditionals := checkChildConditionals(old, new, childMap)
		assert.NotNil(t, conditionals)
		// children := childMap[old]

		if conditionals != nil {
			assert.Len(t, *conditionals, 1)
			assert.Contains(t, *conditionals, "conditional1")
		}

	})

	t.Run("Old with children to overlap means show all that don't overlap", func(t *testing.T) {
		old = "answer2"
		new = "answer1"
		conditionals := checkChildConditionals(old, new, childMap)
		assert.NotNil(t, conditionals)
		// children := childMap[old]

		if conditionals != nil {
			assert.Len(t, *conditionals, 1)
			assert.Contains(t, *conditionals, "conditional3")
		}

	})

}

// testChildMap returns a child map for testing.
// answer1 returns an array of conditional 1 and 2.
// answer2 returns an array of conditional 2 and 3.
func testChildMap() map[string][]models.TranslationField {
	answer1Name := "answer1"
	answer1TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional1",
				Label:   "conditional1",
			},
		},
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional2",
				Label:   "conditional2",
			},
		},
	}

	answer2Name := "answer2"
	answer2TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional3",
				Label:   "conditional3",
			},
		},
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional2",
				Label:   "conditional2",
			},
		},
	}
	childMap := map[string][]models.TranslationField{}

	childMap[answer1Name] = answer1TranslationsQuestion
	childMap[answer2Name] = answer2TranslationsQuestion

	return childMap
}
