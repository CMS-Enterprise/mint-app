package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
)

// GetSolutionSelectedDetails queries the database to return information that is useful
func (s *Store) GetSolutionSelectedDetails(solutionID uuid.UUID) (*email.SolutionSelectedDB, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.Email.SolutionSelectedDetailsGet)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.Email.DiscussionReplyToOriginatorDetailsGet)
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
