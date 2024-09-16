package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

//go:embed translation/table_name.json
var tableNameEnumJSON []byte
var TableNamesTranslationMap = tableNamesTranslationMapFunc()

// TableNamesTranslationMap provides a map of TableName to enum translation
func tableNamesTranslationMapFunc() map[models.TableName]models.EnumTranslation {
	var translation map[models.TableName]models.EnumTranslation
	err := json.Unmarshal(tableNameEnumJSON, &translation)
	if err != nil {
		err := fmt.Errorf("error unmarshalling JSON for tableNameTranslationMap err: %w", err)
		panic(err)

	}
	return translation
}

// TranslateTableName will return a Translation for a table name
func TranslateTableName(tableName models.TableName) (models.EnumTranslation, bool) {
	translation, wasFound := TableNamesTranslationMap[tableName]
	return translation, wasFound
}
