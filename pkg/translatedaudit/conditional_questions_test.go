package translatedaudit

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

// TestCheckChildConditionals verifies the conditional question logic
func TestCheckChildConditionals(t *testing.T) {
	childMap := testChildMap()

	var old interface{}
	var new interface{}
	t.Run("Nil old means no conditionals", func(t *testing.T) {
		conditionals := checkChildConditionals(old, new, childMap)
		assert.Nil(t, conditionals)
	})

	t.Run("Old with children to nil means show all", func(t *testing.T) {
		old = "answer1"
		conditionals := checkChildConditionals(old, new, childMap)
		assert.NotNil(t, conditionals)
		children := getAllChildren([]string{fmt.Sprint(old)}, childMap)

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
	t.Run("Changing Answers that share a conditional will not show not applicable", func(t *testing.T) {
		old = []string{"answer1", "just3"}
		new = []string{"just1", "just2", "just3"} // These hold the same value, so nothing is not applicable now from it
		conditionals := checkChildConditionals(old, new, childMap)
		assert.Nil(t, conditionals)
	})
	t.Run("Compounds answers that don't share a conditional will show not applicable", func(t *testing.T) {
		old = []string{"answer1", "just3"}
		new = []string{"just1", "just2"} // These hold the same value, so nothing is not applicable now from it
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
	answer3Name := "answer3"
	answer3TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional1",
				Label:   "conditional1",
			},
		},
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional4",
				Label:   "conditional4",
			},
		},
	}
	just1Name := "just1"
	just1TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional1",
				Label:   "conditional1",
			},
		},
	}
	just2Name := "just2"
	just2TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional2",
				Label:   "conditional2",
			},
		},
	}
	just3Name := "just3"
	just3TranslationsQuestion := []models.TranslationField{
		{
			TranslationFieldBase: models.TranslationFieldBase{
				DbField: "conditional3",
				Label:   "conditional3",
			},
		},
	}

	childMap := map[string][]models.TranslationField{}

	childMap[answer1Name] = answer1TranslationsQuestion
	childMap[answer2Name] = answer2TranslationsQuestion
	childMap[answer3Name] = answer3TranslationsQuestion
	childMap[just1Name] = just1TranslationsQuestion
	childMap[just2Name] = just2TranslationsQuestion
	childMap[just3Name] = just3TranslationsQuestion

	return childMap
}
