package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/model_follower_update.json
var modelFollowerUpdateJSON []byte

// ModelFollowerUpdateTranslation Provides the translation for Model Follower Update
func ModelFollowerUpdateTranslation() (*model.ModelFollowerUpdateTranslation, error) {
	var translation model.ModelFollowerUpdateTranslation
	err := json.Unmarshal(modelFollowerUpdateJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
