package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_common_solution_contact.json
var mtoCommonSolutionContactJSON []byte

// MTOCommonSolutionContactTranslation Provides the translation for MTO common solution contacts
func MTOCommonSolutionContactTranslation() (*model.MTOCommonSolutionContactTranslation, error) {
	var translation model.MTOCommonSolutionContactTranslation
	err := json.Unmarshal(mtoCommonSolutionContactJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
