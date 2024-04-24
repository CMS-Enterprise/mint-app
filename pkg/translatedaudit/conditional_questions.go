package translatedaudit

import (
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
	var oldChildren []models.TranslationField
	oldStr, oldIsString := old.(string)
	if oldIsString {
		oldChildren = getAllChildren([]string{oldStr}, childrenMap)
	}

	// strSlice, isSlice := isArray(str)
	oldStrSlice, oldIsSlice := old.([]string)
	if oldIsSlice {
		oldChildren = getAllChildren(oldStrSlice, childrenMap)
	}
	if len(oldChildren) < 1 { // There are no questions that no longer apply
		return nil
	}

	var newChildren []models.TranslationField
	newStr, newIsString := new.(string)
	if newIsString {
		newChildren = getAllChildren([]string{newStr}, childrenMap)
	}

	// strSlice, isSlice := isArray(str)
	newStrSlice, newIsSlice := new.([]string)
	if newIsSlice {
		newChildren = getAllChildren(newStrSlice, childrenMap)
	}

	newChildExists := len(newChildren) > 0

	// Check if there is any overlap from old and new, if there is any overlap, don't include in conditionals

	oldMinusNew := oldChildren

	if newChildExists {
		// Get the values from the old array that are not in the new array (thus no longer applicable)
		oldMinusNew, _ = lo.Difference(oldChildren, newChildren)

	}

	//Changes: (Translations) Verify that the new fields don't have an overlap, Verify if we need to look at new children vs old children or just can assume old are no longer applicable

	conditionals := pq.StringArray{}

	for _, child := range oldMinusNew {

		//Changes: (Translations) Should we call get label here? Figure that out
		conditionals = append(conditionals, child.Label)

	}

	return &conditionals

}

func getAllChildren(answers []string, childrenMap map[string][]models.TranslationField) []models.TranslationField {
	allFields := []models.TranslationField{}

	for _, answer := range answers {
		oldChildArray, oldChildExists := childrenMap[answer]
		if !oldChildExists {
			continue
		}
		allFields = append(allFields, oldChildArray...)
	}
	// If multiple answers make a conditional an option, we want to only return unique ones
	uniqFields := lo.UniqBy(allFields, func(field models.TranslationField) string {
		return field.Label
	})
	return uniqFields

}
