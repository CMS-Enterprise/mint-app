package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/model_plan.json
var modelPlanTranslationJSON []byte

func ModelPlanTranslation() (*model.ModelPlanTranslation, error) {
	var translation model.ModelPlanTranslation
	err := json.Unmarshal(modelPlanTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
