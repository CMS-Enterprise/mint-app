package mappings

import "fmt"

// GetTranslation allows programmatic access to return a translation for a given table name
func GetTranslation(tableName string) (Translation, error) {

	switch tableName {
	case "plan_participants_and_providers":
		// trans, err := ParticipantsAndProvidersTranslation()
		return ParticipantsAndProvidersTranslation()
	default:
		return nil, fmt.Errorf("no translation for table: %s ", tableName)

	}

}
