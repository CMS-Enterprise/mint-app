package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractHTMLMentions(t *testing.T) {
	htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	// htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	mentionNodes, err := extractHTMLMentions(htmlMention)
	assert.NotNil(t, mentionNodes)
	assert.NoError(t, err)

	assert.Len(t, mentionNodes, 2)

}

func TestHTMLMentionFromString(t *testing.T) {
	// htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := TagTypeUserAccount
	tag1 := `<span data-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	tag2EUA := "TEST"
	tag2Label := "Terry Thompson"
	tag2Type := TagTypeUserAccount
	tag2 := `<span data-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2EUA + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`
	tag3ID := "3"
	tag3Label := "Salesforce"
	tag3Type := TagTypePossibleSolution
	tag3 := `<span data-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.`
	taggedHTML, err := NewTaggedHTMLFromString(htmlMention)
	assert.NoError(t, err)
	assert.Len(t, taggedHTML.Mentions, 3)
	//TODO: SW can assert the tag content matches the provied tags

	taggedHTML1 := taggedHTML.Mentions[0]
	taggedHTML2 := taggedHTML.Mentions[1]
	taggedHTML3 := taggedHTML.Mentions[2]
	assert.EqualValues(t, tag1EUA, taggedHTML1.EntityRaw)
	assert.EqualValues(t, tag1Label, taggedHTML1.DataLabel)
	assert.EqualValues(t, tag1Type, taggedHTML1.Type)
	assert.EqualValues(t, tag2EUA, taggedHTML2.EntityRaw)
	assert.EqualValues(t, tag2Label, taggedHTML2.DataLabel)
	assert.EqualValues(t, tag2Type, taggedHTML2.Type)

	assert.EqualValues(t, tag3ID, taggedHTML3.EntityRaw)
	assert.EqualValues(t, tag3Label, taggedHTML3.DataLabel)
	assert.EqualValues(t, tag3Type, taggedHTML3.Type)
}
