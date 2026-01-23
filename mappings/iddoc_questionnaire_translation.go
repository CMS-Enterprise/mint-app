package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/iddoc_questionnaire.json
var IddocQuestionnaireTranslationJSON []byte

// IddocQuestionnaireTranslation reads the json embedded file and renders it as a useable translation file
func IddocQuestionnaireTranslation() (*model.IddocQuestionnaireTranslation, error) {
	var translation model.IddocQuestionnaireTranslation
	err := json.Unmarshal(IddocQuestionnaireTranslationJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
