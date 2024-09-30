package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_beneficiaries.json
var beneficiariesJSON []byte

func PlanBeneficiariesTranslation() (*model.PlanBeneficiariesTranslation, error) {
	var translation model.PlanBeneficiariesTranslation
	err := json.Unmarshal(beneficiariesJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
