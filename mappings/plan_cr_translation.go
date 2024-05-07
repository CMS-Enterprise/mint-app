package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/plan_cr.json
var planCrJSON []byte

// PlanCRTranslation Provides the translation for Plan CR
func PlanCRTranslation() (*model.PlanCRTranslation, error) {
	var translation model.PlanCRTranslation
	err := json.Unmarshal(planCrJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
