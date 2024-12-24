package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_milestone.json
var mtoMilestoneJSON []byte

// MTOMilestoneTranslation Provides the translation for MTO Milestone
func MTOMilestoneTranslation() (*model.MTOMilestoneTranslation, error) {
	var translation model.MTOMilestoneTranslation
	err := json.Unmarshal(mtoMilestoneJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
