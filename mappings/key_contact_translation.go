package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/key_contact.json
var keyContactJSON []byte

// KeyContactTranslation Provides the translation for key contacts
func KeyContactTranslation() (*model.KeyContactTranslation, error) {
	var translation model.KeyContactTranslation
	err := json.Unmarshal(keyContactJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
