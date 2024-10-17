package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/data_exchange_approach.json
var planDataExchangeApproachTranslationJSON []byte

// PlanDataExchangeApproachTranslation reads the json embedded file and renders it as a useable translation file
func PlanDataExchangeApproachTranslation() (*model.PlanDataExchangeApproachTranslation, error) {
	var translation model.PlanDataExchangeApproachTranslation
	err := json.Unmarshal(planDataExchangeApproachTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
