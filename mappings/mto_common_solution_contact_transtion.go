package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_common_solution_contact.json
var mtoCommonSolutionContactJSON []byte

//go:embed translation/contractor_translation.json
var MTOCommonSolutionContractorTranslationJSON []byte

// MTOCommonSolutionContactTranslation provides the translation for MTO common solution contacts
func MTOCommonSolutionContactTranslation() (*model.MTOCommonSolutionContactTranslation, error) {
	var translation model.MTOCommonSolutionContactTranslation
	err := json.Unmarshal(mtoCommonSolutionContactJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}

// MTOCommonSolutionContractorTranslation provides the translation for contractors
func MTOCommonSolutionContractorTranslation() (*model.MTOCommonSolutionContractorTranslation, error) {
	var translation model.MTOCommonSolutionContractorTranslation
	err := json.Unmarshal(MTOCommonSolutionContractorTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
