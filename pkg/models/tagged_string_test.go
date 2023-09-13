package models

import (
	"fmt"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestTagsFromRawString(t *testing.T) {
	content := "This is a sample <tag1/> string <tag2 attribute=\"value\"/> containing tags."

	tags, err := tagsFromRawString(content)
	assert.NoError(t, err)

	assert.Len(t, tags, 2)
}

func TestNewTagFromString(t *testing.T) {
	// tagString = "<tag type=\"USER\" entityID=\"34508e34-e3a8-4c1c-8d08-820d71995300\"/>"
	tagString := `<tag type="USER" entityID="34508e34-e3a8-4c1c-8d08-820d71995300"/>`
	entityID := uuid.MustParse("34508e34-e3a8-4c1c-8d08-820d71995300")
	tag, err := newTagFromString(tagString)
	assert.NoError(t, err)

	assert.EqualValues(t, tagString, tag.RawString)
	assert.EqualValues(t, &entityID, tag.EntityUUID)
	assert.EqualValues(t, TagTypeUser, tag.Type)

	solutionID := 4
	tagType := TagTypeSolution
	tagStringSolution := fmt.Sprintf(`<tag type="%s" entityID="%d"/>`, tagType, solutionID)

	tagSol, err := newTagFromString(tagStringSolution)
	assert.NoError(t, err)

	assert.EqualValues(t, tagStringSolution, tagSol.RawString)
	assert.EqualValues(t, &solutionID, tagSol.EntityIntID)
	assert.EqualValues(t, tagType, tagSol.Type)

}
