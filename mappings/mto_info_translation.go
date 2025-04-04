package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/mto_info.json
var mtoInfoJSON []byte

// MTOInfoTranslation Provides the translation for MTO Info
func MTOInfoTranslation() (*model.MTOInfoTranslation, error) {
	var translation model.MTOInfoTranslation
	err := json.Unmarshal(mtoInfoJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
