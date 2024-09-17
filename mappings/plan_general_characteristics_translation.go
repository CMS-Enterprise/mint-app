package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_general_characteristics.json
var generalCharacteristicsJSON []byte

func PlanGeneralCharacteristicsTranslation() (*model.PlanGeneralCharacteristicsTranslation, error) {
	var translation model.PlanGeneralCharacteristicsTranslation
	err := json.Unmarshal(generalCharacteristicsJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
