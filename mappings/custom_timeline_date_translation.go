package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/custom_timeline_date.json
var customTimelineDatesJSON []byte

// CustomTimelineDateTranslation provides the translation for custom timeline dates.
func CustomTimelineDateTranslation() (*model.CustomTimelineDateTranslation, error) {
	var translation model.CustomTimelineDateTranslation
	err := json.Unmarshal(customTimelineDatesJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
