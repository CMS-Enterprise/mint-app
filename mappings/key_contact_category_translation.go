package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/key_contact_category.json
var keyContactCategoryJSON []byte

// KeyContactCategoryTranslation Provides the translation for key contact categories
func KeyContactCategoryTranslation() (*model.KeyContactCategoryTranslation, error) {
	var translation model.KeyContactCategoryTranslation
	err := json.Unmarshal(keyContactCategoryJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
