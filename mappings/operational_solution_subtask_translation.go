package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/operational_solution_subtask.json
var operationalSolutionSubtaskTranslationJSON []byte

func OperationalSolutionSubtaskTranslation() (*model.OperationalSolutionSubtaskTranslation, error) {
	var translation model.OperationalSolutionSubtaskTranslation
	err := json.Unmarshal(operationalSolutionSubtaskTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
