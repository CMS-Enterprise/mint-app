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
	htmlMention := `<p>Hey <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>!  Will you be able to join the meeting next week?  If not, can you contact <span data-type="mention" class="mention" data-id="TEST" data-label="Terry Thompson">@Terry Thompson</span> to let them know?</p>`
	taggedHTML, err := NewTaggedHTMLFromString(htmlMention)
	assert.NoError(t, err)
	assert.Len(t, taggedHTML.Mentions, 2)

}
