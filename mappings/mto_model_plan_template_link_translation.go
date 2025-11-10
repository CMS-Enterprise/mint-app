package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/model_plan_mto_template_link.json
var modelPlanMTOTemplateLinkJSON []byte

// ModelPlanMTOTemplateLinkTranslation Provides the translation for Model Plan MTO Template Link
func ModelPlanMTOTemplateLinkTranslation() (*model.ModelPlanMTOTemplateLinkTranslation, error) {
	var translation model.ModelPlanMTOTemplateLinkTranslation
	err := json.Unmarshal(modelPlanMTOTemplateLinkJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
