package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/timeline.json
var timelineJSON []byte

// TimelineTranslation Provides the translation for Timeline
func TimelineTranslation() (*model.TimelineTranslation, error) {
	var translation model.TimelineTranslation
	err := json.Unmarshal(timelineJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
