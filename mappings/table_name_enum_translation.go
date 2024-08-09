package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed translation/table_name.json
var tableNameEnumJSON []byte

// TableNamesTranslationMap provides a map of TableName to enum translation
func TableNamesTranslationMap() (map[models.TableName]model.EnumTranslation, error) {
	var translation map[models.TableName]model.EnumTranslation
	err := json.Unmarshal(tableNameEnumJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return translation, nil

}
