package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_task.json
var planTaskJSON []byte

// PlanTaskTranslation provides the translation for plan tasks.
func PlanTaskTranslation() (*model.PlanTaskTranslation, error) {
	var translation model.PlanTaskTranslation
	err := json.Unmarshal(planTaskJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
