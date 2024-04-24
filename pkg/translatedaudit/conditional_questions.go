package translatedaudit

import (
	"fmt"

	"github.com/lib/pq"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
)

// checkChildConditionals will check if changes to a question make any questions non applicable
func checkChildConditionals(old interface{}, new interface{}, childrenMap map[string][]models.TranslationField) *pq.StringArray {
	// Changes: (Translations) check if we need to deal with an array for children.. EG if it is a multiselect, we need to check each value, not just one like we are doing

	if old == nil {
		return nil
	}
	oldChildArray, oldChildExists := childrenMap[fmt.Sprint(old)]
	if !oldChildExists {
		return nil
	}
	// Check if there is any overlap from old and new, if there is any overlap, don't include in conditionals
	newChildArray, newChildExists := childrenMap[fmt.Sprint(new)]
	oldMinusNew := oldChildArray

	if newChildExists {
		// Get the values from the old array that are not in the new array (thus no longer applicable)
		oldMinusNew, _ = lo.Difference(oldChildArray, newChildArray)

	}

	//Changes: (Translations) Verify that the new fields don't have an overlap, Verify if we need to look at new children vs old children or just can assume old are no longer applicable

	conditionals := pq.StringArray{}

	for _, child := range oldMinusNew {

		//Changes: (Translations) Should we call get label here? Figure that out
		conditionals = append(conditionals, child.Label)

	}

	return &conditionals

}
