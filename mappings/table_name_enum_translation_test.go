package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TableNamesTranslationMap provides a map of TableName to enum translation
func TestTableNamesTranslationMap(t *testing.T) {
	assert := assert.New(t)

	translationMap := TableNamesTranslationMap
	assert.NotNil(translationMap)

	// TODO: iterate over all table names and assert there is a translation
	// This will happen in a future PR when the logic is added for analyzed audit.
	// for _, tableName := range v {

	// }

}
