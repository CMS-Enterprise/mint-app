package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/operational_need.json
var operationalNeedTranslationJSON []byte

func OperationalNeedTranslation() (*model.OperationalNeedTranslation, error) {
	var translation model.OperationalNeedTranslation
	err := json.Unmarshal(operationalNeedTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
