package storage

import (
	"context"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

func (s StoreTestSuite) TestListSystems() {
	// random-based signatures, just so multiple runs of this test don't collide
	now := time.Now()

	// #nosec G404
	rnd := rand.New(rand.NewSource(now.Unix()))
	base := make([]byte, 8)
	_, err := rnd.Read(base)
	s.NoError(err)

	// setup construction
	ctx := context.Background()
	expected := map[string]bool{}

	// retrieve the list of systems
	results, err := s.store.listSystems(ctx)
	s.NoError(err)

	// verify the list of Systems that we seeded came back to us
	found := 0
	for _, result := range results {
		s.NotEqual(result.ID, uuid.Nil) // ensure we populate with a real IntakeID
		if _, exp := expected[result.LCID]; !exp {
			// unexpected collision from previously existing data,
			// possibly from previous runs of this test
			continue
		}
		found++
	}
	s.Equal(found, len(expected), "did not retrieve the expected amound of Systems")
}
