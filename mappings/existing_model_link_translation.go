package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/existing_model_link.json
var ExistingModelLinkTranslationJSON []byte

func ExistingModelLinkTranslation() (*model.ExistingModelLinkTranslation, error) {
	var translation model.ExistingModelLinkTranslation
	err := json.Unmarshal(ExistingModelLinkTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
