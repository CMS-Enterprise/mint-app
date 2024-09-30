package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_payments.json
var planPaymentsTranslationJSON []byte

func PlanPaymentsTranslation() (*model.PlanPaymentsTranslation, error) {
	var translation model.PlanPaymentsTranslation
	err := json.Unmarshal(planPaymentsTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
