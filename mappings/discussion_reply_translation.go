package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

//go:embed translation/discussion_reply.json
var discussionReplyJSON []byte

// DiscussionReplyTranslation Provides the translation for Plan Discussion
func DiscussionReplyTranslation() (*model.DiscussionReplyTranslation, error) {
	var translation model.DiscussionReplyTranslation
	err := json.Unmarshal(discussionReplyJSON, &translation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil

}
