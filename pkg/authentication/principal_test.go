package authentication

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestPrincipal(t *testing.T) {
	// Arrange

	// using current time for a bit of fuzzing
	now := time.Now().Unix()
	okMINT := bool(now%2 == 0)
	okGRT := bool(now%3 == 0)
	id := fmt.Sprintf("%X", now)

	testCases := map[string]struct {
		p          Principal
		expectID   string
		expectMINT bool
		expectGRT  bool
	}{
		"anonymous is unauthorized": {
			p:          ANON,
			expectID:   anonID,
			expectMINT: false,
			expectGRT:  false,
		},
		"regular eua user": {
			p: &EUAPrincipal{
				EUAID:       id,
				JobCodeMINT: okMINT,
				JobCodeGRT:  okGRT,
			},
			expectID:   id,
			expectMINT: okMINT,
			expectGRT:  okGRT,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			// Act - not needed

			//Assert
			assert.NotEmpty(t, tc.p.String(), "fmt.Stringer")
			assert.NotEmpty(t, tc.p.ID(), "ID()")
			assert.Equal(t, tc.expectID, tc.p.ID(), "ID()")
			assert.Equal(t, tc.expectMINT, tc.p.AllowMINT(), "AllowMINT()")
			assert.Equal(t, tc.expectGRT, tc.p.AllowGRT(), "AllowGRT()")
		})
	}
}
