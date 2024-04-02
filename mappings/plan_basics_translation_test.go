package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanBasicsTranslation(t *testing.T) {
	translation, err := PlanBasicsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)
	//TODO: (ChChCh Changes!) Need to assert that each field actually has the value, if it doesn't map up, it will show just 0 values

}

func TestPlanBasicsTranslationAsMap(t *testing.T) {
	translation, err := PlanBasicsTranslation()
	assert.IsType(t, translation.DemoCode, models.TranslationField{})

	assert.NoError(t, err)
	assert.NotNil(t, translation)
	assert.EqualValues(t, "plan_basics", translation.TableName())

	basicsMap, err := translation.ToMap()
	// basicsMap, err := PlanBasicsTranslationMap()
	// basicsMap, err := models.StructToTranslationMap(translation)
	// basicsMap, err := models.StructToTypedMap[models.ITranslationField](translation)
	// basicsMap, err := models.StructToMapDBTag(*translation)
	// basicsMap, err := translation.ToMap()
	// basicsMap, err := models.StructToTranslationMap(*translation)
	// basicsMap, err := models.StructToMap(translation)

	assert.NoError(t, err)
	assert.NotNil(t, basicsMap)

	// t.Run("Can cast to expected type", func(t *testing.T) {
	fieldToInvestigate := "demo_code"

	fieldInterface, ok := basicsMap[fieldToInvestigate]
	assert.True(t, ok)
	assert.NotNil(t, fieldInterface)

	// castFieldGen, isCast := fieldInterface.(models.ITranslationField)
	// assert.True(t, isCast)
	// assert.NotNil(t, castFieldGen)

	castField, isCast := fieldInterface.(models.TranslationField)
	assert.True(t, isCast)
	assert.NotNil(t, castField)

	// })
}
