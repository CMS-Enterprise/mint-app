package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/plan_participants_and_providers.json
var partsAndProvidersTranslationJSON []byte

// PlanParticipantsAndProvidersTranslation Provides the translation for Participants and Providers
func PlanParticipantsAndProvidersTranslation() (*model.PlanParticipantsAndProvidersTranslation, error) {
	var participantsTranslation model.PlanParticipantsAndProvidersTranslation
	err := json.Unmarshal(partsAndProvidersTranslationJSON, &participantsTranslation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &participantsTranslation, nil

}
