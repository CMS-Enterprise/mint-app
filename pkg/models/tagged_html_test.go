package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractHTMLSpansRegex(t *testing.T) {
	htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	// htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	mentionNodes, err := extractHTMLSpansRegex(htmlMention) //Can we just
	assert.NotNil(t, mentionNodes)
	assert.NoError(t, err)

	assert.Len(t, mentionNodes, 2)

}

func TestHTMLMentionFromString(t *testing.T) {
	// htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	tag2EUA := "TEST"
	tag2Label := "Terry Thompson"
	tag2Type := TagTypeUserAccount
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2EUA + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`
	tag3ID := "3"
	tag3Label := "Salesforce"
	tag3Type := TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.`
	taggedContent, err := NewTaggedContentFromString(htmlMention)
	assert.NoError(t, err)
	assert.Len(t, taggedContent.Mentions, 3)

	mention1 := taggedContent.Mentions[0]
	mention2 := taggedContent.Mentions[1]
	mention3 := taggedContent.Mentions[2]
	assert.EqualValues(t, tag1EUA, mention1.EntityRaw)
	assert.EqualValues(t, tag1Label, mention1.DataLabel)
	assert.EqualValues(t, tag1Type, mention1.Type)
	assert.EqualValues(t, tag2EUA, mention2.EntityRaw)
	assert.EqualValues(t, tag2Label, mention2.DataLabel)
	assert.EqualValues(t, tag2Type, mention2.Type)

	assert.EqualValues(t, tag3ID, mention3.EntityRaw)
	assert.EqualValues(t, tag3Label, mention3.DataLabel)
	assert.EqualValues(t, tag3Type, mention3.Type)
}
