package translatedaudit

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/storage"
)

//Changes: (fk) Should this be moved into it's own package?

func translateForeignKey(store *storage.Store, value interface{}, tableReference string) (interface{}, error) {
	if value == nil {
		return nil, nil
	}
	if store == nil {
		return nil, fmt.Errorf("the store was nil, but is required to translate foreign key fields ")
	}

	//Changes: (fk) Refactor this, and handle errors etc
	switch tableReference {
	case "user_account":
		{
			return getUserAccountForeignKeyTranslation(store, value)
		}
	default:
		return nil, fmt.Errorf("there is no configured method to return the table reference for %s", tableReference)
	}
}

func getUserAccountForeignKeyTranslation(store *storage.Store, key interface{}) (string, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the user account reference. err %w", err)
	}

	// get the account
	account, err := storage.UserAccountGetByID(store, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the user account foreign key reference. err %w", err)
	}
	// can update the translation as needed.
	return account.CommonName, nil

}

// parseInterfaceToUUID is a utility value to try and cast an interface to a UUID
// it first attempts to parse the value directly to a UUID, and then while try to parse a string to UUID
// If neither is possible, it will return uuid.Nil and an error
func parseInterfaceToUUID(val interface{}) (uuid.UUID, error) {
	uuidKey, isUUID := val.(uuid.UUID)
	if isUUID {
		return uuidKey, nil
	}

	stringKey, isString := val.(string)
	if isString {
		// Changes: (fk) Should we validate the id of the key? parse only tries to parse, it doesn't actually validate the string
		parsedUUID, err := uuid.Parse(stringKey)
		if err != nil {
			return uuid.Nil, fmt.Errorf("unable to parse string to UUID. err %w", err)
		}
		return parsedUUID, nil
	}

	return uuid.Nil, fmt.Errorf("there was an issue casting the provided value (%v) to UUID. It is of type %T", val, val)

}
