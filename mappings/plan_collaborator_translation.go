package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

//Changes (ChChCh Changes!) Update export file name to not be plural so it matches db tables

//go:embed translation/plan_collaborators.json
var collaboratorJSON []byte

func PlanCollaboratorsTranslation() (*model.PlanCollaboratorTranslation, error) {
	var translation model.PlanCollaboratorTranslation
	err := json.Unmarshal(collaboratorJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
