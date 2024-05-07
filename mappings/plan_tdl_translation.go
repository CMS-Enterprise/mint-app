package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/plan_tdl.json
var planTDlJSON []byte

// PlanTDLTranslation Provides the translation for Plan CR
func PlanTDLTranslation() (*model.PlanTDLsTranslation, error) {
	var translation model.PlanTDLsTranslation
	err := json.Unmarshal(planTDlJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
