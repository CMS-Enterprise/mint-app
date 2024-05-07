package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/operational_solution.json
var operationalSolutionTranslationJSON []byte

func OperationalSolutionTranslation() (*model.OperationalSolutionTranslation, error) {
	var translation model.OperationalSolutionTranslation
	err := json.Unmarshal(operationalSolutionTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
