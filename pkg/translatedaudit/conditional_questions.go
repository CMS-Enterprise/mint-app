package translatedaudit

import (
	"github.com/lib/pq"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
)

// checkChildConditionals will check if changes to a question make any questions non applicable
// if so, return an array of the question label.
func checkChildConditionals(old interface{}, new interface{}, childrenMap map[string][]models.TranslationField) *pq.StringArray {

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

	oldStrPQ, oldIsPqStringArray := old.(pq.StringArray)
	if oldIsPqStringArray {
		oldChildren = getAllChildren(oldStrPQ, childrenMap)
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
	newStrPQ, newIsPqStringArray := new.(pq.StringArray)
	if newIsPqStringArray {
		newChildren = getAllChildren(newStrPQ, childrenMap)
	}

	newChildExists := len(newChildren) > 0

	// Check if there is any overlap from old and new, if there is any overlap, don't include in conditionals

	oldMinusNew := oldChildren

	if newChildExists {
		// Get the values from the old array that are not in the new array (thus no longer applicable)
		oldMinusNew, _ = lo.Difference(oldChildren, newChildren)

	}
	if len(oldMinusNew) < 1 {
		return nil
	}

	conditionals := pq.StringArray{}

	for _, child := range oldMinusNew {

		conditionals = append(conditionals, child.GetLabel())

	}

	return &conditionals

}

// getAllChildren returns a list of unique children for an array of answers
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
		return field.GoField
	})
	return uniqFields

}
