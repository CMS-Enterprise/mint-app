package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/plan_discussion.json
var discussionJSON []byte

// PlanDiscussionTranslation Provides the translation for Plan Discussion
func PlanDiscussionTranslation() (*model.PlanDiscussionsTranslation, error) {
	var translation model.PlanDiscussionsTranslation
	err := json.Unmarshal(discussionJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
