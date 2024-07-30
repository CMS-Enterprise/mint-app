package translatedaudit

import (
	"fmt"

	"github.com/cmsgov/mint-app/mappings"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetDatabaseOperation casts the string representation of a database action to the appropriate enum
// the boolean return value will be true for a successful matching, and false if unmatched
func GetDatabaseOperation(action string) (models.DatabaseOperation, bool) {

	switch action {
	case "I":
		return models.DBOpInsert, true
	case "D":
		return models.DBOpDelete, true
	case "U":
		return models.DBOpUpdate, true
	case "T":
		return models.DBOpTruncate, true
	}
	return models.DatabaseOperation(""), false

}

// getTranslationMapAndTranslateSingleValue is a utility function to translate a single field value to a translated value, assuming that the key for the translation, and the function to get the function is passed
// it should be used in places where you need to get a single outlier translation (such as meta data) instead of normal operations where you can batch some of these data calls.
func getTranslationMapAndTranslateSingleValue(tableName models.TableName, translationKey string, rawValue string) string {

	translation, err := mappings.GetTranslation(tableName)
	if err == nil {
		translationMap, err := translation.ToMap()
		if err == nil {

			translationInterface, hasTranslation := translationMap[translationKey]
			// translate if a translation is available
			if hasTranslation {
				options, hasOptions := translationInterface.GetOptions()
				// if the translation has options, use the options to translate the value
				if hasOptions {
					translation := translateValueSingle(rawValue, options)
					return fmt.Sprint(translation)
				}
			}
		}
	}
	// if this could not be translated return the raw initial value instead
	return rawValue

}
