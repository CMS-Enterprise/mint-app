package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/plan_ops_eval_and_learning.json
var opsEvalAndLearningJSON []byte

func PlanOpsEvalAndLearningTranslation() (*model.PlanOpsEvalAndLearningTranslation, error) {
	var translation model.PlanOpsEvalAndLearningTranslation
	err := json.Unmarshal(opsEvalAndLearningJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
