package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_category.json
var mtoCategoryJSON []byte

// MTOCategoryTranslation Provides the translation for MTO Category
func MTOCategoryTranslation() (*model.MTOCategoryTranslation, error) {
	var translation model.MTOCategoryTranslation
	err := json.Unmarshal(mtoCategoryJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
