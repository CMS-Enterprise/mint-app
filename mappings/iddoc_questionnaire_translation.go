package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/iddoc_questionnaire.json
var iddocQuestionnaireJSON []byte

// IddocQuestionnaireTranslation provides the translation for IDDOC questionnaire
func IddocQuestionnaireTranslation() (*model.IddocQuestionnaireTranslation, error) {
	var translation model.IddocQuestionnaireTranslation
	err := json.Unmarshal(iddocQuestionnaireJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
