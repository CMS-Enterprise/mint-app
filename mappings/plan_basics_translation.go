package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//go:embed translation/plan_basics.json
var basicsJSON []byte

// PlanBasicsTranslation Provides the translation for Plan basics
func PlanBasicsTranslation() (*model.PlanBasicsTranslation, error) {
	var translation model.PlanBasicsTranslation
	err := json.Unmarshal(basicsJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}

// PlanBasicsTranslationMap Provides the translation for Plan basics
func PlanBasicsTranslationMap() (map[string]interface{}, error) {
	var translation map[string]interface{}
	err := json.Unmarshal(basicsJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return translation, nil

}
