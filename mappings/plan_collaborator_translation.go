package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_collaborator.json
var collaboratorJSON []byte

func PlanCollaboratorTranslation() (*model.PlanCollaboratorTranslation, error) {
	var translation model.PlanCollaboratorTranslation
	err := json.Unmarshal(collaboratorJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
