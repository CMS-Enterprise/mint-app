package storage

import (
	_ "embed"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
)

//go:embed SQL/email/solution_selected_details_get.sql
var solutionSelectedDetailsGet string

//go:embed SQL/email/discussion_reply_to_originator_details_get.sql
var discussionReplyToOriginatorDetailsGet string

// GetSolutionSelectedDetails queries the database to return information that is useful
func (s *Store) GetSolutionSelectedDetails(solutionID uuid.UUID) (*email.SolutionSelectedDB, error) {
	stmt, err := s.db.PrepareNamed(solutionSelectedDetailsGet)
	if err != nil {

		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"sol_id": solutionID,
	}
	solDetails := email.SolutionSelectedDB{}

	err = stmt.Get(&solDetails, arg)
	if err != nil {

		return nil, err

	}
	return &solDetails, nil
}

// GetDiscussionReplyDetailsForEmail returns Discussion replies along with user account information for each reply.
// It is sorted by the database with the newest replies going to oldest replies.
func (s *Store) GetDiscussionReplyDetailsForEmail(discussionID uuid.UUID) ([]*email.DiscussionReplyEmailContentDB, error) {

	var discRSlice []*email.DiscussionReplyEmailContentDB

	stmt, err := s.db.PrepareNamed(discussionReplyToOriginatorDetailsGet)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"disc_id": discussionID,
	}

	err = stmt.Select(&discRSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return discRSlice, nil

}
