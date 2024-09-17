package flags

import (
	"context"
	"crypto/sha256"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

func TestPrincipal(t *testing.T) {
	testCases := map[string]struct {
		ctx  context.Context
		anon bool
	}{
		"anonymous": {
			context.Background(),
			true,
		},
		"disempowered": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.ApplicationPrincipal{Username: "WEAK"},
			),
			true,
		},
		"submitter": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.ApplicationPrincipal{Username: "MINT", JobCodeUSER: true},
			),
			false,
		},
		"reviewer": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.ApplicationPrincipal{Username: "BOSS", JobCodeASSESSMENT: true},
			),
			false,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			base := appcontext.Principal(tc.ctx)

			ldContext := Principal(tc.ctx)

			assert.Equal(t, tc.anon, ldContext.Anonymous())
			assert.NotEqual(t, base.ID(), ldContext.Key())
			assert.Equal(t, len(ldContext.Key()), sha256.Size*2)
			// t.Logf("key: %s\n", ldContext.GetKey())
		})
	}
}
