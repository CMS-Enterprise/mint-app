package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_common_solution_contractor.json
var mtoCommonSolutionContractorJSON []byte

// MTOCommonSolutionContractorTranslation Provides the translation for MTO common solution contractors
func MTOCommonSolutionContractorTranslation() (*model.MTOCommonSolutionContractorTranslation, error) {
	var translation model.MTOCommonSolutionContractorTranslation
	err := json.Unmarshal(mtoCommonSolutionContractorJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
