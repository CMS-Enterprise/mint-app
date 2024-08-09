package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TableNamesTranslationMap provides a map of TableName to enum translation
func TestTableNamesTranslationMap(t *testing.T) {
	assert := assert.New(t)

	translationMap, err := TableNamesTranslationMap()
	assert.NoError(err)
	assert.NotNil(translationMap)

	// TODO: iterate over all table names and assert there is a translation
	// for _, tableName := range v {

	// }

}
