package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/waiver.json
var waiverJSON []byte

// WaiverTranslation provides the translation for model plan waiver selections.
func WaiverTranslation() (*model.WaiverTranslation, error) {
	var translation model.WaiverTranslation
	err := json.Unmarshal(waiverJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
