package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_milestone_note.json
var mtoMilestoneNoteJSON []byte

// MTOMilestoneNoteTranslation Provides the translation for MTO Milestone Note
func MTOMilestoneNoteTranslation() (*model.MTOMilestoneNoteTranslation, error) {
	var translation model.MTOMilestoneNoteTranslation
	err := json.Unmarshal(mtoMilestoneNoteJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
