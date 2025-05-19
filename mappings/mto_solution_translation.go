package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_solution.json
var mtoSolutionJSON []byte

// MTOSolutionTranslation Provides the translation for MTO Solution
func MTOSolutionTranslation() (*model.MTOSolutionTranslation, error) {
	var translation model.MTOSolutionTranslation
	err := json.Unmarshal(mtoSolutionJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
