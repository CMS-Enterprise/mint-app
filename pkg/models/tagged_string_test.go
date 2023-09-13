package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTagsFromRawString(t *testing.T) {
	content := "This is a sample <tag1/> string <tag2 attribute=\"value\"/> containing tags."

	tags, err := tagsFromRawString(content)
	assert.NoError(t, err)

	assert.Len(t, tags, 2)
}
