package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/waiver_assessment_survey.json
var waiverAssessmentSurveyJSON []byte

// WaiverAssessmentSurveyTranslation provides the translation for the waiver assessment survey.
func WaiverAssessmentSurveyTranslation() (*model.WaiverAssessmentSurveyTranslation, error) {
	var translation model.WaiverAssessmentSurveyTranslation
	err := json.Unmarshal(waiverAssessmentSurveyJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
