package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_milestone_solution_link.json
var mtoMilestoneSolutionLinkJSON []byte

// MTOMilestoneSolutionLinkTranslation Provides the translation for MTO Milestone Solution Link
func MTOMilestoneSolutionLinkTranslation() (*model.MTOMilestoneSolutionLinkTranslation, error) {
	var translation model.MTOMilestoneSolutionLinkTranslation
	err := json.Unmarshal(mtoMilestoneSolutionLinkJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
