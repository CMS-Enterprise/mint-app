package translatedaudit

import "github.com/cmsgov/mint-app/pkg/models"

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
