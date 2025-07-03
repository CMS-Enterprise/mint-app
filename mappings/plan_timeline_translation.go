package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_timeline.json
var timelineJSON []byte

// PlanTimelineTranslation Provides the translation for Timeline
func PlanTimelineTranslation() (*model.PlanTimelineTranslation, error) {
	var translation model.PlanTimelineTranslation
	err := json.Unmarshal(timelineJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
